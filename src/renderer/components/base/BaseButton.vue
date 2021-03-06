<template>
    <button
        v-bind="$attrs"
        :class="[color, size, { 'is-dark' : isDark, 'is-outline': isOutline, 'is-popover': isPopover }]"
        :disabled="disabled"
        @click="$emit('click', $event)"
    >
        <span>
            <slot />
        </span>
    </button>
</template>

<script>
export default {
    name: 'BaseButton',
    inheritAttrs: false,
    props: {
        isOutline: {
            type: Boolean,
            required: false,
            default: false
        },

        isPopover: {
            type: Boolean,
            required: false,
            default: false
        },

        isDark: {
            type: Boolean,
            required: false,
            default: false
        },

        color: {
            type: String,
            required: false,
            default: ''
        },

        size: {
            type: String,
            default: ''
        },

        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
    $padding-v: 2;
    $padding-h: 4;

    $padding-small-v: 1.5;
    $padding-small-h: 2.5;

    button {
        position: relative;
        padding: emRhythm($padding-v) emRhythm($padding-h);
        background: $color--white-light;
        cursor: pointer;
        color: $color--dark;
        border: 1px solid $color--dark;
        display: inline-block;
        outline: none;

        @include rhythmBorderTop(1px, $padding-v);
        @include rhythmBorderBottom(1px, $padding-v);

        @include font-heavy();

        transition: color 0.25s ease-in-out, background-color 0.25s ease-in-out, border-color 0.25s ease-in-out;

        // gradient
        &:before,
        &:after {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            content: '';
            transition: opacity 0.25s ease-out;
            opacity: 0;
        }

        &:after {
            background: transparent;
        }

        /*&:hover,
        &:focus {
            background: $color--white;

            span {
                opacity: 1;
            }
        }*/

        span {
            opacity: 0.85;
            transition: opacity 0.25s ease-in-out;
        }

        .has-shadow {
            @include box-shadow();
        }

        &.small {
            padding: emRhythm($padding-small-v, $silent: true) emRhythm($padding-small-h, $silent: true);
            @include rhythmBorderTop(1px, $padding-small-v);
            @include rhythmBorderBottom(1px, $padding-small-v);
        }

        &.is-outline {
            background-color: transparent;
            border-color: rgba($color--dark, 0.5);

            span {
                opacity: 0.7;
            }

            &:after {
                @include glow-small-box($color--polo, 0);
                //opacity: 1;
            }

            &[disabled] {
                opacity: 0.66;
            }

            &:not([disabled]) {
                &:hover,
                &:focus {
                    // color: $color--red-bright;
                    border-color: $color--dark;
                    background-color: $color--white-light;

                    &:after,
                    span {
                        opacity: 1;
                    }
                }
            }

            &.is-dark {
                background-color: rgba($color--dark, 0.2);
                color: $color--white-light;
                border-color: $color--white-light;
                outline: none;

                &:hover,
                &:focus {
                    background: rgba($color--dark, 0.4);
                    border-color: $color--white;
                    color: $color--white;
                }
            }

            &.red {
                color: $color--red-bright;
                border-color: $color--red;

                &:after {
                    @include glow-small-box($color--red, 0);
                }

                &:hover,
                &:focus {
                    color: $color--red-bright;
                    border-color: $color--red-bright;
                }
            }

            &.orange {
                color: $color--orange;
                border-color: $color--orange;

                &:after {
                    @include glow-small-box($color--orange, 0);
                }

                &:hover,
                &:focus {
                    color: $color--orange-bright;
                    border-color: $color--orange-bright;
                }
            }
        }

        &:not([disabled]) {
            &.green,
            &.orange,
            &.red,
            &.comet {
                &:not(.is-outline) {
                    //padding-top: emRhythm($padding-v);
                    //padding-bottom: emRhythm($padding-v);
                    //border: none;
                    outline: none;
                    color: $color--white-light;

                    &:not([disabled]) {
                        &:hover,
                        &:focus {
                            &:before {
                                opacity: 0.5;
                            }

                            &:after {
                                opacity: 1;
                            }

                            span {
                                color: $color--white;
                                opacity: 1;
                            }

                            &.is-popover {
                                box-shadow: 0 1px 2px rgba($color--dark, 0.5);
                            }
                        }
                    }

                    &.is-popover {
                        box-shadow: inset 0 1px 2px rgba($color--dark, 0.5);
                    }

                    span {
                        position: relative;
                        z-index: 2;
                    }

                    &.green {
                        background: $color--green;
                        border-color: transparent;

                        &:before {
                            background: $gradient--green-bright;
                        }

                        &:after {
                            @include glow-small-box($color--green, 0);
                        }

                        &[disabled] {
                            background: rgba(mix($color--green, $color--dark, 40%), 0.25);
                            border-color: $color--green;
                            color: $color--white;

                            span {
                                opacity: 1;
                            }

                            &.is-dark {
                                color: mix($color--green-dark, $color--dark, 15%);
                                background: rgba(mix($color--green, $color--dark), 0.2);
                                border-color: mix($color--green-dark, $color--dark);
                            }
                        }
                    }

                    &.comet {
                        background: $color--comet-dark;
                        border-color: transparent;

                        &:before {
                            background: $gradient--comet-dark-vertical;
                        }

                        &:after {
                            @include glow-small-box($color--comet-dark, 0);
                        }

                        &[disabled] {
                            background: mix($color--green, grayscale($color--green));
                        }
                    }

                    &.orange {
                        background: $color--orange;
                        border-color: transparent;

                        &:before {
                            background: $gradient--orange-vertical;
                        }

                        &:after {
                            @include glow-small-box($color--orange, 0);
                        }

                        &[disabled] {
                            background: mix($color--orange, grayscale($color--orange));
                        }
                    }

                    &.red {
                        background: $color--red;
                        border-color: transparent;

                        &:before {
                            background: $gradient--red-vertical;
                        }

                        &:after {
                            @include glow-small-box($color--red, 0);
                        }

                        &[disabled] {
                            background: mix($color--red, grayscale($color--red));
                        }
                    }
                }
            }
        }

        &[disabled] {
            cursor: default;
        }
    }
</style>
