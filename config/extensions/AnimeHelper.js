/**
 * @class AnimeHelper
 * @version 4.9.0
 * @summary A high-level utility class to simplify and streamline the creation of complex animations using Anime.js.
 * @description This helper abstracts common animation patterns like scroll-triggered reveals, text splitting,
 * timeline orchestration, and element pinning into a declarative, easy-to-use API.
 *
 * @changelog 4.9.0 — Added `prefers-reduced-motion` support. When the user has requested reduced motion,
 *                    all animation durations and delays are set to 0 so element states are still applied
 *                    correctly but no visible motion occurs.
 */
export class AnimeHelper {
  _anime;
  _animateFn;
  _timelineFn;
  _scopeFn;
  _resolveTargetsFn;
  _textSplitFn;
  _scrollFn;
  _animatable;

  /**
   * @type {boolean}
   * @private
   * @description Whether the user has requested reduced motion via OS accessibility settings.
   */
  _prefersReducedMotion = false;

  /**
   * @type {Map<string, object>}
   * @private
   * @static
   * @description A map to store and retrieve animation instances by their string selector.
   */
  static _instances = new Map();
  /**
   * @type {Array<object>}
   * @private
   * @static
   * @description A queue for timeline syncing operations, processed after all instances are created.
   */
  static _syncQueue = [];

  /* ========================== GLOBAL FUNCTIONS ================================ */

  /**
   * @static
   * @description Processes the sync queue, linking slave timelines to their masters. Should be called after all helpers are initialized.
   */
  static applySyncs() {
    this._syncQueue.forEach(
      ({ slave, masterSelector, offset }) => {
        const masterTimeline =
          this._instances.get(masterSelector);
        if (
          masterTimeline &&
          typeof masterTimeline.sync ===
            "function"
        ) {
          masterTimeline.sync(slave, offset);
        } else {
          console.warn(
            `AnimeHelper: Could not find a master timeline with target "${masterSelector}" to sync with.`,
          );
        }
      },
    );
    this._syncQueue = [];
  }

  /**
   * @type {Object.<string, Function>}
   * @private
   * @static
   * @description A registry for animation presets that can be used across instances.
   */
  static _presets = {
    fadeIn: (config) => {
      const from = config.from || "bottom";
      const defaultDistance = 20;
      const animation = {
        opacity: [0, 1],
      };
      switch (from) {
        case "top":
          animation.translateY = [
            -defaultDistance,
            0,
          ];
          break;
        case "left":
          animation.translateX = [
            -defaultDistance,
            0,
          ];
          break;
        case "right":
          animation.translateX = [
            defaultDistance,
            0,
          ];
          break;
        case "bottom":
        default:
          animation.translateY = [
            defaultDistance,
            0,
          ];
          break;
      }
      return animation;
    },
  };

  /**
   * Adds a new animation preset to the helper.
   * @static
   * @param {string} name - The name of the preset.
   * @param {Function} generator - A function that takes a config object and returns an anime.js params object.
   */
  static addPreset(name, generator) {
    if (
      typeof name !== "string" ||
      typeof generator !== "function"
    ) {
      console.error(
        "AnimeHelper.addPreset() requires a string name and a generator function.",
      );
      return;
    }
    this._presets[name] = generator;
  }

  /**
   * Retrieves a stored animation instance by its selector.
   * @static
   * @param {string} instanceName - The string selector used to create the animation.
   * @returns {object|undefined} The anime.js animation instance.
   */
  static get(instanceName) {
    return this._instances.get(instanceName);
  }

  /**
   * Retrieves the entire map of stored animation instances.
   * @static
   * @returns {Map<string, object>} The map of all named instances.
   */
  static getAll() {
    return this._instances;
  }

  /**
   * Reverts a specific animation instance to its original state.
   * @static
   * @param {string} instanceName - The selector of the instance to kill.
   */
  static kill(instanceName) {
    this.#assignMethodToAnimation(
      this.get(instanceName),
      "revert",
    );
  }

  /**
   * Reverts all stored animation instances.
   * @static
   */
  static killAll() {
    this.#assignMethodToAnimation(
      this.getAll(),
      "revert",
    );
  }

  /**
   * Plays a specific animation instance.
   * @static
   * @param {string} instanceName - The selector of the instance to play.
   */
  static play(instanceName) {
    this.#assignMethodToAnimation(
      this.get(instanceName),
      "play",
    );
  }

  /**
   * Plays all stored animation instances.
   * @static
   */
  static playAll() {
    this.#assignMethodToAnimation(
      this.getAll(),
      "play",
    );
  }

  /**
   * Pauses a specific animation instance.
   * @static
   * @param {string} instanceName - The selector of the instance to pause.
   */
  static pause(instanceName) {
    this.#assignMethodToAnimation(
      this.get(instanceName),
      "pause",
    );
  }

  /**
   * Pauses all stored animation instances.
   * @static
   */
  static pauseAll() {
    this.#assignMethodToAnimation(
      this.getAll(),
      "pause",
    );
  }

  /**
   * Resumes a specific animation instance.
   * @static
   * @param {string} instanceName - The selector of the instance to resume.
   */
  static resume(instanceName) {
    this.#assignMethodToAnimation(
      this.get(instanceName),
      "resume",
    );
  }

  /**
   * Resumes all stored animation instances.
   * @static
   */
  static resumeAll() {
    this.#assignMethodToAnimation(
      this.getAll(),
      "resume",
    );
  }

  /**
   * Restarts a specific animation instance.
   * @static
   * @param {string} instanceName - The selector of the instance to restart.
   */
  static restart(instanceName) {
    this.#assignMethodToAnimation(
      this.get(instanceName),
      "restart",
    );
  }

  /**
   * Restarts all stored animation instances.
   * @static
   */
  static restartAll() {
    this.#assignMethodToAnimation(
      this.getAll(),
      "restart",
    );
  }

  /* ========================== HELPER FUNCTIONS ================================ */

  /**
   * A private static helper to apply a method to a single instance or a map of instances.
   * @private
   * @static
   * @param {object|Map<string, object>} instance - The animation instance or a Map of instances.
   * @param {string} method - The name of the method to call (e.g., 'play', 'pause').
   */
  static #assignMethodToAnimation(
    instance,
    method,
  ) {
    if (!instance) return;

    if (instance instanceof Map) {
      instance.forEach((animation) => {
        if (
          animation &&
          typeof animation[method] === "function"
        ) {
          animation[method]();
        }
      });
      return;
    }

    if (
      instance &&
      typeof instance[method] === "function"
    ) {
      instance[method]();
    }
  }

  /**
   * Converts a numerical delay or configuration object into an anime.js stagger function.
   * @param {number|object} staggerConfig - The stagger delay in milliseconds, or an object containing { value, from, direction, etc. }
   * @returns {Function} An anime.js stagger function.
   * @private
   */
  _delayToStagger(staggerConfig) {
    if (
      staggerConfig !== null &&
      typeof staggerConfig === "object" &&
      !Array.isArray(staggerConfig)
    ) {
      const { value, ...options } = staggerConfig;
      return this._anime.stagger(value, options);
    }
    return this._anime.stagger(staggerConfig);
  }

  /**
   * Retrieves a preset animation configuration object.
   * @param {string} preset - The name of the preset.
   * @param {object} config - The user's main configuration object.
   * @returns {object} The preset's parameter object.
   * @private
   */
  _getPreset(preset, config) {
    if (preset) {
      const presetFn =
        this.constructor._presets[preset];
      if (presetFn) {
        return presetFn(config);
      }
    }
    return {};
  }

  /**
   * Applies reduced-motion overrides to an animation params object.
   * Sets duration and delay to 0 so element states are applied instantly with no visible motion.
   * @param {object} params - The animation params object to override.
   * @returns {object} The modified params object.
   * @private
   */
  _applyReducedMotion(params) {
    if (!this._prefersReducedMotion)
      return params;
    return { ...params, duration: 0, delay: 0 };
  }

  /**
   * Parses a CSS value string into a number and unit.
   * @param {string} cssValue - The CSS value to parse (e.g., '100vh', '-50px').
   * @returns {{value: number, unit: string}|null} An object with the value and unit.
   * @private
   */
  _parseCssValue(cssValue) {
    if (typeof cssValue !== "string") return null;
    const match = cssValue.match(
      /^(\-?[\d\.]+)([a-z%]*)$/i,
    );
    if (match) {
      const [, value, unit] = match;
      return {
        value: parseFloat(value),
        unit: unit || "",
      };
    }
    return null;
  }

  /**
   * Creates the DOM structure and applies CSS for the pinning effect.
   * @param {HTMLElement} parentTarget - The element that will act as the scrollable track.
   * @param {object} config - The pin configuration from `pinParams`.
   * @private
   */
  _createPin(parentTarget, config) {
    const {
      duration = "auto",
      start = "0px",
      target,
    } = config;
    const trackElement =
      this._resolveTargetsFn(parentTarget)[0];
    if (!trackElement) {
      console.warn(
        `AnimeHelper Pin: Could not find the track element "${parentTarget}".`,
      );
      return;
    }

    const pinElements = target
      ? this._resolveScopedTargets(
          target,
          trackElement,
        )
      : [trackElement];

    if (
      !pinElements ||
      pinElements.length === 0
    ) {
      console.warn(
        `AnimeHelper Pin: Could not find the pin target "${target}" inside "${parentTarget}".`,
      );
      return;
    }

    pinElements.forEach((el) => {
      el.style.position = "sticky";
      el.style.top = start;
    });

    if (duration !== "auto") {
      const relativeValues = ["-=", "+="];
      if (
        relativeValues.some((value) =>
          duration.includes(value),
        )
      ) {
        const currentHeight =
          trackElement.offsetHeight;
        const { value: durationValue } =
          this._parseCssValue(
            duration.substring(2),
          );
        let newHeight = currentHeight;

        if (duration.includes("+=")) {
          newHeight =
            currentHeight + durationValue;
        } else if (duration.includes("-=")) {
          newHeight =
            currentHeight - durationValue;
        }
        trackElement.style.height = `${newHeight}px`;
      } else {
        trackElement.style.height = duration;
      }
    }
  }

  /**
   * Resolves targets (string, array, etc.) but scopes the search to within a parent element.
   * @param {string|Array|HTMLElement|NodeList} targets - The targets to resolve.
   * @param {HTMLElement} parent - The parent element to search within.
   * @returns {Array<HTMLElement>} An array of the found elements.
   * @private
   */
  _resolveScopedTargets(targets, parent) {
    // If no parent is provided, we default to the global resolver.
    if (!parent) {
      return this._resolveTargetsFn(targets);
    }
    // First, use the powerful global resolver to handle all input types.
    const allPossibleTargets =
      this._resolveTargetsFn(targets);
    // Then, filter the results to keep only the elements contained within the parent.
    return allPossibleTargets.filter((el) =>
      parent.contains(el),
    );
  }

  /**
   * Expands an array of elements by replacing each element with its direct
   * HTMLElement children. Elements that have no element children are kept as-is.
   * Used by the `animateChild` option to animate child nodes instead of their wrapper.
   * @param {HTMLElement[]} elements - A flat array of resolved elements.
   * @returns {HTMLElement[]} The expanded array.
   * @private
   */
  _expandToChildren(elements) {
    const result = [];
    for (const el of elements) {
      const children = Array.from(el.children);
      if (children.length > 0) {
        result.push(...children);
      } else {
        result.push(el);
      }
    }
    return result;
  }

  /* ========================== CORE METHODS ================================ */

  /**
   * Initializes the AnimeHelper instance.
   * @param {object} animeInstance - An instance of the Anime.js library.
   */
  constructor(animeInstance) {
    const lib =
      animeInstance ||
      (typeof window !== "undefined"
        ? window.anime
        : undefined);
    if (!lib)
      throw new Error("Anime.js not found.");
    this._anime = lib;
    this._animateFn = lib.animate || lib;
    this._timelineFn =
      lib.createTimeline || lib.timeline;
    this._scopeFn = lib.createScope || lib.scope;
    this._resolveTargetsFn =
      lib.utils?.$ || lib.$;
    this._textSplitFn =
      lib.text?.split || lib.splitText;
    this._scrollFn = lib.scroll || lib.onScroll;
    this._animatable =
      lib.animatable || lib.createAnimatable;

    // Detect prefers-reduced-motion at construction time.
    // Animations will still be applied (so element end-states are correct),
    // but duration and delay will be set to 0 — no visible motion.
    if (
      typeof window !== "undefined" &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
    ) {
      this._prefersReducedMotion = true;
    }
  }

  /**
   * Creates a scroll observer if scrollParams are provided.
   * @param {string|HTMLElement|Array<HTMLElement>} targets - The element to observe.
   * @param {object} config - The main configuration object.
   * @returns {object|undefined} An Anime.js scroll observer instance.
   * @private
   */
  _createScrollObserver(targets, config) {
    if (!this._scrollFn || !config.scrollParams) {
      return undefined;
    }

    const { scrollParams, scrollContainer } =
      config;
    const observerTarget =
      this._resolveTargetsFn(targets)[0];

    if (!observerTarget) {
      console.warn(
        `AnimeHelper: Could not find a target for the scroll observer.`,
      );
      return undefined;
    }

    const observerConfig = {
      target: observerTarget,
      container: scrollContainer,
      ...scrollParams,
    };

    return this._scrollFn(observerConfig);
  }

  /**
   * Normalize targets to handle mixed arrays of selectors and elements.
   * @param {string|HTMLElement|Array<string|HTMLElement>} targets
   * @returns {string|HTMLElement|Array<HTMLElement>} Normalized targets
   */
  _normalizeTargets(targets) {
    // If it's not an array, return as-is (handles string selectors and single elements)
    if (!Array.isArray(targets)) {
      return targets;
    }

    // If it's an array, flatten and resolve all items
    const resolved = [];

    for (const item of targets) {
      if (typeof item === "string") {
        // CSS selector string - query all matching elements
        const elements =
          document.querySelectorAll(item);
        resolved.push(...elements);
      } else if (item instanceof HTMLElement) {
        // Single DOM element
        resolved.push(item);
      } else if (Array.isArray(item)) {
        // Nested array - flatten recursively
        const nested =
          this._normalizeTargets(item);
        if (Array.isArray(nested)) {
          resolved.push(...nested);
        } else if (
          nested instanceof HTMLElement
        ) {
          resolved.push(nested);
        }
      } else if (
        item instanceof NodeList ||
        item instanceof HTMLCollection
      ) {
        // NodeList or HTMLCollection
        resolved.push(...item);
      }
    }

    return resolved.length > 0 ? resolved : null;
  }

  /**
   * The main method to create and control animations.
   * @param {string|HTMLElement|Array<string|HTMLElement>} targets - The primary target for the animation or effect.
   *        Can be a CSS selector string, an HTMLElement, or an array containing any mix of these.
   * @param {object} config - The configuration object for the animation.
   * @param {number|object} [config.stagger] - When set AND targets is an array, all elements are animated
   *        together in one call with a staggered delay rather than creating separate observer instances.
   *        Accepts the same values as splitParams.stagger — a plain ms number or an object like
   *        { value: 80, from: 'center' }. The scroll observer (if any) is anchored to the first element.
   *        @example
   *        // Stagger-reveal two elements with one shared scroll trigger:
   *        animeHelper.observe([eyebrowEl, descriptionEl], {
   *          preset: 'fadeIn',
   *          stagger: 300,
   *          scrollParams: { enter: 'start 85%', once: true },
   *          params: { duration: 400 }
   *        });
   * @returns {object|Array<object>|undefined} The created Anime.js instance(s).
   */
  observe(targets, config) {
    if (!config) {
      console.warn(
        "AnimeHelper.observe() expects a configuration object.",
      );
      return;
    }

    // If targets is an array AND stagger is set, animate all as one with a single shared observer.
    // The scroll observer is anchored to the first resolved element; delay becomes anime.stagger().
    if (Array.isArray(targets) && config.stagger !== undefined) {
      const flatTargets = this._normalizeTargets(targets);
      if (!flatTargets || flatTargets.length === 0) return;

      // Expand each element to its direct children when animateChild is set.
      // Elements with no element children fall back to animating themselves.
      const animationTargets = config.animateChild
        ? this._expandToChildren(flatTargets)
        : flatTargets;

      // Apply initialState styles immediately to prevent a flash of unstyled content
      // before the animation starts (e.g. children that are visible before opacity animates in).
      if (config.initialState) {
        for (const el of animationTargets) {
          Object.assign(el.style, config.initialState);
        }
      }

      // Scroll observer stays anchored to the first *original* element (the wrapper),
      // not a child — so the trigger point is always consistent.
      const scrollAnchor = flatTargets[0];

      // If config.params.delay is a plain number, treat it as the stagger sequence start offset
      // so it shifts the whole stagger forward — rather than being overwritten by the stagger fn.
      const paramsDelay = config.params?.delay;
      const baseStart = typeof paramsDelay === "number" ? paramsDelay : 0;
      const staggerInput =
        typeof config.stagger === "object" && !Array.isArray(config.stagger)
          ? { ...config.stagger, start: config.stagger.start ?? baseStart }
          : { value: config.stagger, start: baseStart };
      const staggerDelay = this._delayToStagger(staggerInput);

      // Build scroll observer anchored to the first element
      const scrollObserver =
        config.scrollParams && this._scrollFn
          ? this._scrollFn({
              target: scrollAnchor,
              container: config.scrollContainer,
              ...config.scrollParams,
            })
          : undefined;

      const presetParams = this._getPreset(config.preset, config);
      // Strip the manual delay from params — it's already baked into the stagger start offset.
      const { delay: _baseDelay, ...restParams } = config.params || {};
      const finalParams = this._applyReducedMotion({
        ...presetParams,
        ...restParams,
        delay: staggerDelay,
        ...(scrollObserver ? { autoplay: scrollObserver } : {}),
      });

      return this._animateFn(animationTargets, finalParams);
    }

    // If targets is an array, create separate observer instances for each
    // This allows each container to trigger its animation independently on scroll
    if (Array.isArray(targets)) {
      const instances = [];
      for (const target of targets) {
        // Shallow clone to preserve functions (e.g. easing callbacks, run scopes)
        // while cloning nested parameter objects to prevent shared reference mutations.
        const clonedConfig = {
          ...config,
          params: config.params
            ? { ...config.params }
            : undefined,
          scrollParams: config.scrollParams
            ? { ...config.scrollParams }
            : undefined,
          splitParams: config.splitParams
            ? { ...config.splitParams }
            : undefined,
          timelineParams: config.timelineParams
            ? { ...config.timelineParams }
            : undefined,
        };
        const instance = this.observe(
          target,
          clonedConfig,
        );
        if (instance) instances.push(instance);
      }
      return instances.length > 0
        ? instances
        : undefined;
    }

    // Single target (string selector or element)
    const normalizedTargets =
      this._normalizeTargets(targets);

    let animationInstance;
    let animationTarget = normalizedTargets;
    let observerTarget = normalizedTargets;

    if (config.pin) {
      const pinParams = config.pinParams || {};
      observerTarget = targets;
      animationTarget =
        pinParams.target || targets;
      this._createPin(targets, pinParams);
      config.type = "scroll";
      config.scrollParams = {
        target: observerTarget,
        enter: "start start",
        leave: "end end",
        ...config.scrollParams,
      };
    }

    if (config.type === "scroll") {
      const finalAnimationTarget =
        config.animationTarget ||
        config.pinParams?.target ||
        config.pinParams?.targets ||
        targets;
      const finalObserverTarget =
        config.animationTarget
          ? targets
          : finalAnimationTarget;

      animationInstance =
        this._createScrollAnimation(
          finalAnimationTarget,
          finalObserverTarget,
          config,
        );
    } else {
      const scrollObserver =
        this._createScrollObserver(
          observerTarget,
          config,
        );
      const effectiveParams = {
        ...(config.params || {}),
      };
      if (scrollObserver) {
        effectiveParams.autoplay = scrollObserver;
      } else if (config.reusable) {
        effectiveParams.autoplay = false;
        delete config.reusable;
      }
      const effectiveConfig = {
        ...config,
        params: effectiveParams,
      };

      switch (effectiveConfig.type) {
        case "animatable":
          animationInstance =
            this._createAnimatable(
              animationTarget,
              config.params,
            );
          break;
        case "splitText":
          animationInstance =
            this._createTextSplitAnimation(
              animationTarget,
              effectiveConfig,
            );
          break;
        case "scope":
          animationInstance =
            this._createScopedAnimation(
              animationTarget,
              effectiveConfig,
            );
          break;
        case "timeline":
          animationInstance = this._buildTimeline(
            animationTarget,
            effectiveConfig,
          );
          break;
        default:
          animationInstance =
            this._createSingleAnimation(
              animationTarget,
              effectiveConfig,
            );
      }
    }

    if (
      typeof targets === "string" &&
      animationInstance
    ) {
      this.constructor._instances.set(
        targets,
        animationInstance,
      );
    }

    if (config.syncWith) {
      this.constructor._syncQueue.push({
        slave: animationInstance,
        masterSelector: config.syncWith,
        offset: config.offset,
      });
    }

    return animationInstance;
  }

  /**
   * Creates a stateful, controllable animatable instance.
   * @param {string|HTMLElement|Array<HTMLElement>} targets - The animation targets.
   * @param {object} config - The animatable parameters object.
   * @returns {object} An anime.js animatable instance.
   * @private
   */
  _createAnimatable(targets, config) {
    return this._animatable(targets, config);
  }

  /**
   * Creates a scrubbing scroll animation.
   * @param {string|HTMLElement|Array<HTMLElement>} animationTargets - The element(s) to animate.
   * @param {string|HTMLElement|Array<HTMLElement>} observerTargets - The element that drives the scroll progress.
   * @param {object} config - The main configuration object.
   * @returns {object} An anime.js animation instance.
   * @private
   */
  _createScrollAnimation(
    animationTargets,
    observerTargets,
    config,
  ) {
    const {
      params = {},
      scrollParams = {},
      scrollContainer,
      preset,
    } = config;

    if (!this._scrollFn) {
      console.error(
        "AnimeHelper: Scroll module (anime.onScroll || anime.scroll) not found.",
      );
      return;
    }

    const observerTarget = this._resolveTargetsFn(
      observerTargets,
    )[0];
    if (!observerTarget) {
      console.warn(
        `AnimeHelper: Could not find a target for the scroll animation.`,
      );
      return;
    }

    const scrollConfig = {
      target: observerTarget,
      container: scrollContainer,
      ...scrollParams,
      sync: true,
    };

    const finalAnimationTargets =
      config.animationTarget
        ? this._resolveScopedTargets(
            animationTargets,
            observerTarget,
          )
        : this._resolveTargetsFn(
            animationTargets,
          );

    return this._animateFn(
      finalAnimationTargets,
      {
        ...this._getPreset(preset, config),
        ...this._applyReducedMotion(params),
        autoplay: this._scrollFn(scrollConfig),
      },
    );
  }

  /**
   * Creates a text splitting animation.
   * @param {string|HTMLElement|Array<HTMLElement>} targets - The text element to split and animate.
   * @param {object} config - The main configuration object.
   * @returns {object} An anime.js animation or timeline instance.
   * @private
   */
  _createTextSplitAnimation(targets, config) {
    if (!this._textSplitFn) {
      console.error(
        "AnimeHelper: TextSplitter module (anime.text.split) not found.",
      );
      return;
    }

    const {
      splitBy = "words",
      splitParams = {},
      params: animationParams = {},
      timelineParams = {},
    } = config;

    if (Array.isArray(splitBy)) {
      return this._createMultiSplitTimeline(
        targets,
        {
          splitBy,
          splitParams,
          timelineParams,
        },
      );
    }

    const {
      from = "bottom",
      stagger = 50,
      distance = "1em",
      debug = false,
      splitOptions = {},
    } = splitParams;

    const text = this._textSplitFn(targets, {
      [splitBy]: splitOptions,
      debug,
    });
    const splitTargets = text[splitBy];

    if (
      !splitTargets ||
      splitTargets.length === 0
    ) {
      console.warn(
        `AnimeHelper: Could not find any "${splitBy}" to animate.`,
      );
      return;
    }

    const transforms = {
      top: { translateY: [-distance, 0] },
      bottom: { translateY: [distance, 0] },
      left: { translateX: [-distance, 0] },
      right: { translateX: [distance, 0] },
    };

    const generatedProps = {
      opacity: [0, 1],
      ...(transforms[from] || transforms.bottom),
    };

    let presetParams = {};
    if (config.preset) {
      presetParams = this._getPreset(
        config.preset,
        config,
      );
    }

    const finalConfig = this._applyReducedMotion({
      delay: this._delayToStagger(stagger),
      ...generatedProps,
      ...presetParams,
      ...animationParams,
    });

    return this._animateFn(
      splitTargets,
      finalConfig,
    );
  }

  /**
   * Creates a multi-layered text splitting timeline.
   * @param {string|HTMLElement|Array<HTMLElement>} targets - The text element to split.
   * @param {object} config - An object containing splitBy, splitParams, and timelineParams.
   * @returns {object} An anime.js timeline instance.
   * @private
   */
  _createMultiSplitTimeline(
    targets,
    { splitBy, splitParams, timelineParams },
  ) {
    const { debug = false, splitOptions = {} } =
      splitParams;

    if (
      !timelineParams ||
      !Array.isArray(timelineParams.steps) ||
      timelineParams.steps.length !==
        splitBy.length
    ) {
      console.error(
        "AnimeHelper: When 'splitBy' is an array, 'timelineParams.steps' must also be an array of the same length.",
      );
      return;
    }

    // Clone timelineParams and its steps to prevent mutating the user's config
    const clonedTimelineParams = {
      ...timelineParams,
      steps: timelineParams.steps.map((step) => ({
        ...step,
        params: { ...step.params },
      })),
    };

    if (
      !Array.isArray(splitOptions) ||
      splitOptions.length === 0
    ) {
      console.error(
        "AnimeHelper: When 'splitBy' is an array, 'splitOptions' must also be an array of the same length or contain at least one element.",
      );
      return;
    }

    const buildSplit = splitBy.reduce(
      (acc, curr, index) => {
        acc[curr] = splitOptions[index];
        return acc;
      },
      {},
    );

    const splitValues = this._textSplitFn(
      targets,
      { ...buildSplit, debug },
    );

    clonedTimelineParams.steps.forEach(
      (step, index) => {
        step.target = splitValues[splitBy[index]];
        if (step.params && step.params.stagger) {
          step.params.delay =
            this._delayToStagger(
              step.params.stagger,
            );
        }
        if (step.stagger) {
          step.offset = this._delayToStagger(
            step.stagger,
          );
          delete step.stagger;
        }
        // Apply reduced motion to each step's params
        if (step.params) {
          step.params = this._applyReducedMotion(
            step.params,
          );
        }
      },
    );

    return this._buildTimeline(
      null,
      clonedTimelineParams,
    );
  }

  /**
   * Creates a scoped animation.
   * @param {string|HTMLElement|Array<HTMLElement>} targets - The root element for the scope.
   * @param {object} config - The main configuration object.
   * @returns {object} An anime.js scope instance.
   * @private
   */
  _createScopedAnimation(targets, config) {
    const scopeParams = { ...config.scopeParams };
    scopeParams.root = targets;
    const scope = this._scopeFn(scopeParams);

    if (typeof config.run !== "function") {
      console.warn(
        'AnimeHelper: type "scope" requires a "run" function.',
      );
      return scope;
    }

    scope.add(() => {
      const userContext = {
        matches: scope.matches,
        utils: this._anime.utils,
        methods: {
          register: (name, func) =>
            scope.add(name, func),
        },
      };
      config.run(userContext);
      if (typeof config.onRevert === "function") {
        return () => config.onRevert(userContext);
      }
    });
    return scope;
  }

  /**
   * Creates a single, standard animation instance.
   * @param {string|HTMLElement|Array<HTMLElement>} targets - The animation targets.
   * @param {object} config - The main configuration object.
   * @param {boolean} [returnAnimation=true] - Whether to return a full instance or just the params object.
   * @returns {object} An anime.js animation instance or a parameter object.
   * @private
   */
  _createSingleAnimation(
    targets,
    config,
    returnAnimation = true,
  ) {
    let animationParams = { ...config.params };
    if (config.preset) {
      const preset =
        this.constructor._presets[config.preset];
      if (preset) {
        animationParams = {
          ...preset(config),
          ...animationParams,
        };
      }
    }

    animationParams = this._applyReducedMotion(
      animationParams,
    );

    if (!returnAnimation) {
      return animationParams;
    }

    return this._animateFn(
      targets,
      animationParams,
    );
  }

  /**
   * Builds an anime.js timeline from a declarative configuration.
   * @param {string|HTMLElement|Array<HTMLElement>|null} parentTargets - The parent element(s) for nested target selectors.
   * @param {object} config - The main configuration object.
   * @returns {object} An anime.js timeline instance.
   * @private
   */
  _buildTimeline(parentTargets, config) {
    const timelineParams = { ...config.params };
    const mainTl = this._timelineFn(
      timelineParams,
    );

    // Resolve all parent elements (handles arrays of elements)
    const parentElements = this._resolveTargetsFn(
      parentTargets,
    );

    if (
      parentElements.length === 0 &&
      parentTargets !== null
    ) {
      console.warn(
        "AnimeHelper: Could not find a valid parent element for the timeline.",
      );
    }

    if (Array.isArray(config.offsetLabel)) {
      config.offsetLabel.forEach((labelDef) => {
        if (labelDef.label) {
          mainTl.label(
            labelDef.label,
            labelDef.offset,
          );
        }
      });
    }

    if (Array.isArray(config.steps)) {
      config.steps.forEach((originalStep) => {
        // Clone the step to prevent mutating the user's original config object
        const step = {
          ...originalStep,
          params: { ...originalStep.params },
        };

        if (step.instance) {
          mainTl.sync(step.instance, step.offset);
          return;
        }

        // Collect child elements from ALL parent elements
        let childElements = [];
        if (Array.isArray(step.target)) {
          childElements = step.target;
        } else if (parentElements.length > 0) {
          // Query within each parent and collect all matching children
          parentElements.forEach((parent) => {
            const found =
              this._resolveScopedTargets(
                step.target,
                parent,
              );
            childElements.push(...found);
          });
        } else if (parentTargets === null) {
          // Only query globally if NO parent was expected (parentTargets was explicitly null)
          childElements = this._resolveTargetsFn(
            step.target,
          );
        }
        // If parentTargets was provided but not found, childElements stays empty
        // This prevents animations from applying to unrelated elements globally

        if (childElements.length > 0) {
          if (step.params?.stagger) {
            step.params.delay =
              this._delayToStagger(
                step.params.stagger,
              );
            delete step.params.stagger;
          }
          if (step.stagger) {
            step.offset = this._delayToStagger(
              step.stagger,
            );
            delete step.stagger;
          }

          // Apply reduced motion to step params
          if (step.params) {
            step.params =
              this._applyReducedMotion(
                step.params,
              );
          }

          const addAnimationParams =
            this._createSingleAnimation(
              childElements,
              step,
              false,
            );
          mainTl.add(
            childElements,
            addAnimationParams,
            step.offset,
          );
        } else if (parentTargets !== null) {
          // Only warn if a parent was expected
          console.warn(
            `AnimeHelper: Timeline step target "${step.target}" not found. Parent "${parentTargets}" may not exist.`,
          );
        }
      });
    }

    if (Array.isArray(config.call)) {
      config.call.forEach((callDef) => {
        if (typeof callDef.func === "function") {
          mainTl.call(
            () => callDef.func(mainTl),
            callDef.at,
          );
        }
      });
    }

    if (timelineParams.init || config.init) {
      return mainTl.init();
    }

    return mainTl;
  }

  /**
   * Returns the underlying anime.js library instance.
   * @returns {object} The anime.js instance.
   */
  get anime() {
    return this._anime;
  }
}

if (typeof window !== "undefined") {
  window.AnimeHelper = AnimeHelper;
}
