#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

// --- Custom Imports (Đã xóa CodePush) ---
#import "RNSplashScreen.h"
#import <Firebase.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <AVFoundation/AVFoundation.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"IELTS Hunter";
  // You can add your custom initial props in the dictionary below.
  self.initialProps = @{};

  // 1. Cấu hình Firebase
  [FIRApp configure];

  // 2. Cấu hình Audio Session (Cho Livestream/WebRTC)
  [self configureAudioSession];

  // 3. Khởi chạy React Native
  BOOL success = [super application:application didFinishLaunchingWithOptions:launchOptions];

  if (success) {
    // 4. Facebook SDK Setup
    [[FBSDKApplicationDelegate sharedInstance] application:application
                         didFinishLaunchingWithOptions:launchOptions];
    
    // 5. Show Splash Screen
    [RNSplashScreen show];
  }

  return success;
}

/// --- Cấu hình Bundle URL (Đã sửa lại về mặc định) ---
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  // KHÔNG dùng CodePush nữa, trỏ về file main.jsbundle gốc trong app
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// --- Xử lý Deep Linking & Authentication ---
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  // 1. Xử lý Facebook Login
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  // 2. Xử lý Google Sign-In
  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }

  return [RCTLinkingManager application:app openURL:url options:options];}

// --- Hàm hỗ trợ Audio (Giữ nguyên) ---
- (void)configureAudioSession
{
  AVAudioSession *session = AVAudioSession.sharedInstance;
  NSError *error = nil;

  if (@available(iOS 10.0, *)) {
      [session
        setCategory:AVAudioSessionCategoryPlayAndRecord
        mode:AVAudioSessionModeVoiceChat
        options:AVAudioSessionCategoryOptionDefaultToSpeaker | AVAudioSessionCategoryOptionAllowBluetooth
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
      
      [session setMode:AVAudioSessionModeVoiceChat error:&error];
  }
    
  [session setActive:YES error:&error];
}

@end
