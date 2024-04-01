#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"
#import <Firebase.h>
#import <GoogleSignIn/GoogleSignIn.h>
//facebook login
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
//feat livestream
#import <AVFoundation/AVFoundation.h>
#import <React/RCTLinkingManager.h>
//feat codepush
#import <CodePush/CodePush.h>

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"IELTS Hunter";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  [FIRApp configure];

  bool didFinish=[super application:application didFinishLaunchingWithOptions:launchOptions];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                       didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];  // here

AVAudioSession *session = AVAudioSession.sharedInstance;
  NSError *error = nil;

  if (@available(iOS 10.0, *)) {
      [session
        setCategory:AVAudioSessionCategoryPlayAndRecord
        mode:AVAudioSessionModeVoiceChat
        options:AVAudioSessionCategoryOptionDefaultToSpeaker|AVAudioSessionCategoryOptionAllowBluetooth
        error:&error];
    } else {
      SEL selector = NSSelectorFromString(@"setCategory:withOptions:error:");
      
      NSArray * optionsArray =
          [NSArray arrayWithObjects:
            [NSNumber numberWithInteger:AVAudioSessionCategoryOptionAllowBluetooth],
            [NSNumber numberWithInteger:AVAudioSessionCategoryOptionDefaultToSpeaker], nil];
      
      [session
        performSelector:selector
        withObject: AVAudioSessionCategoryPlayAndRecord
        withObject: optionsArray
      ];
      
      [session 
        setMode:AVAudioSessionModeVoiceChat 
        error:&error
      ];
    }
    
    [session 
      setActive:YES 
      error:&error
    ];
  return didFinish;
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL];
#endif
}

// - (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<NSString *,id> *)options {
//   return [RCTLinkingManager application:application openURL:url options:options] || [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options] || [GIDSignIn.sharedInstance handleURL:url];
// }

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }

  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }

  return NO;
}



/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
