package com.surefuel.surefuelapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.wix.interactable.Interactable;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.RNFirebasePackage;
// optional packages - add/remove as appropriate
import io.invertase.firebase.admob.RNFirebaseAdMobPackage; //Firebase AdMob
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // Firebase Analytics
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // Firebase Auth
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage; // Firebase Remote Config
import io.invertase.firebase.database.RNFirebaseDatabasePackage; // Firebase Realtime Database
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage; // Firebase Firestore
import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage; // Firebase Instance ID
import io.invertase.firebase.links.RNFirebaseLinksPackage; // Firebase Dynamic Links
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // Firebase Cloud Messaging
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // Firebase Notifications
import io.invertase.firebase.perf.RNFirebasePerformancePackage; // Firebase Performance
import io.invertase.firebase.storage.RNFirebaseStoragePackage; // Firebase Storage
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage; // Crashlytics

import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage; // <--- This!


import java.util.Arrays;
import java.util.List;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

public class MainApplication extends Application implements ReactApplication {

    //=================REACT NATIVE FBSDK==============================================>
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }
    //=================REACT NATIVE FBSDK==============================================>


    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new Interactable(),
                    new FBSDKPackage(mCallbackManager),
                    new RNFirebasePackage(),
                    // add/remove these packages as appropriate
                    new RNFirebaseAdMobPackage(),
                    new RNFirebaseAnalyticsPackage(),
                    new RNFirebaseAuthPackage(),
                    new RNFirebaseCrashlyticsPackage(),
                    new RNFirebaseDatabasePackage(),
                    new RNFirebaseFirestorePackage(),
                    new RNFirebaseInstanceIdPackage(),
                    new RNFirebaseLinksPackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNFirebaseNotificationsPackage(),
                    new RNFirebasePerformancePackage(),
                    new RNFirebaseRemoteConfigPackage(),
                    new RNFirebaseStoragePackage(),
                    new MapsPackage(),
                    new LinearGradientPackage()

            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        AppEventsLogger.activateApp(this);
         FacebookSdk.sdkInitialize(getApplicationContext());
    }
}
