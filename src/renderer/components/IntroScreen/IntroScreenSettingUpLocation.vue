<template>
    <div class="restarting">
        <template v-if="isEnabled()">
            <div class="icon">
                <loading-bounce class="bounce" />
            </div>
            <main>
                <h2>{{ $t('onboarding.location-daemon-restart.title') }}</h2>
                <p v-html="$t('onboarding.location-daemon-restart.description')" />
            </main>
        </template>
        <template v-else-if="currentBlockHeight === undefined">
            <div class="icon">
                <loading-bounce class="bounce" />
            </div>
            <main>
                <h2>{{ $t('onboarding.location-daemon-restart-loading-blockchain.title') }}</h2>
                <p v-html="$t('onboarding.location-daemon-restart-loading-blockchain.description')" />
            </main>
        </template>
        <template v-else-if="!walletVersion">
            <div class="icon">
                <loading-bounce class="bounce" />
            </div>
            <main>
                <h2>{{ $t('onboarding.location-daemon-restart-loading-wallet.title') }}</h2>
                <p v-html="$t('onboarding.location-daemon-restart-loading-wallet.description')" />
            </main>
        </template>
        <template v-else>
            <div>
                <overlay-success
                    class="icon"
                    :on-animation-end="() => showNextButton = true"
                />
            </div>
            <main>
                <h2>{{ $t('onboarding.location-daemon-restart-success.title') }}</h2>
                <p v-html="$t('onboarding.location-daemon-restart-success.description')" />

                <!--
                <transition name="fade">
                    <footer v-show="showNextButton">
                        <base-button
                            color="green" @click="() => actions.next()">
                            Next
                        </base-button>
                    </footer>
                </transition>
                -->
            </main>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import GuideStepMixin from '@/mixins/GuideStepMixin'
import EventBusMixin from '@/mixins/EventBusMixin'

import LoadingBounce from '@/components/Icons/LoadingBounce'
import OverlaySuccess from '@/components/Icons/OverlaySuccess'

export default {
    name: 'IntroScreenSettingUpDirectory',
    components: {
        OverlaySuccess,
        LoadingBounce
    },

    mixins: [
        GuideStepMixin,
        EventBusMixin
    ],

    data () {
        return {
            eventBusName: 'popover:intro',
            showNextButton: false,
            waitForInitialize: false
        }
    },

    computed: {
        ...mapGetters({
            currentBlockHeight: 'Blockchain/currentBlockHeight',
            walletVersion: 'App/walletVersion',
            hasLocation: 'App/hasBlockchainLocation',
            hasApiStatus: 'ApiStatus/hasApiStatus',
            isInitialRun: 'App/isInitialRun',
            isRestarting: 'App/isRestarting',
            walletExist: 'App/walletExist',
            isRunning: 'App/isRunning',
            apiStatus: 'ApiStatus/apiStatus',
            initialRunSet: 'App/initialRunSet'
        })
    },

    created() {
        // This is needed to prevent the condition where hasApiStatus is set to true between the time the component is
        // loaded and the watch() is set.
        //this.waitForInit();
        this.waitForSettingupLocation();
    },

    methods: {
        // part of GuideStepMixin
        isEnabled () {
            return true;
        },
        waitForSettingupLocation() {
            setTimeout(() => {
                if (this.hasApiStatus && this.initialRunSet && this.apiStatus.data && !this.apiStatus.data.rescanning && this.apiStatus.data.walletinitialized) {
                    if (this.isInitialRun || !this.walletExist) {
                        this.actions.goTo('createOrRestore');
                    } else {
                        console.log('go to lock created');
                        this.actions.goTo('lock');
                    }
                } else {
                    this.waitForSettingupLocation();
                }
            }, 5000);
        },
        
    }
}
</script>

<style lang="scss" scoped>
.restarting {
    display: flex;
    align-items: center;
    padding-bottom: emRhythm(1);

    main {
        margin-left: emRhythm(3);
    }

    h2 {
        margin: 0 0 emRhythm(2, $ms-up2);
    }

    p:last-of-type {
        margin-bottom: 0;
    }

    .icon {
        $dim: emRhythm(12);
        width: $dim;
        height: $dim;
    }

    .bounce {
        $dim: emRhythm(6);
        width: $dim;
        height: $dim;
        margin-top: emRhythm(3);
        margin-left: emRhythm(5);
    }

    footer {
        padding-top: emRhythm(3);
        text-align: right;
    }
}
</style>
