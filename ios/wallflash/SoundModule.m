#import "SoundModule.h"
#import <AudioToolbox/AudioToolbox.h>
#import <AVFoundation/AVFoundation.h>

@implementation SoundModule {
    NSMutableDictionary<NSString *, AVAudioPlayer *> *_players;
    BOOL _isMuted;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        _players = [NSMutableDictionary new];
        _isMuted = NO;
        NSArray *sounds = @[@"tap", @"step", @"connect", @"cut", @"incomplete", @"win", @"reset", @"click", @"download", @"set_success", @"like", @"premium"];
        for (NSString *name in sounds) {
            NSString *resourceName = [NSString stringWithFormat:@"tc_%@", name];
            NSURL *url = [[NSBundle mainBundle] URLForResource:resourceName withExtension:@"wav"];
            if (url) {
                NSError *error = nil;
                AVAudioPlayer *player = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
                if (player && !error) {
                    [player prepareToPlay];
                    _players[name] = player;
                }
            }
        }
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_METHOD(play:(NSString *)name) {
    [self playSound:name rate:1.0 volume:1.0];
}

RCT_EXPORT_METHOD(playSound:(NSString *)name rate:(double)rate volume:(double)volume) {
    if (_isMuted) return;
    AVAudioPlayer *player = _players[name];
    if (player) {
        player.volume = (float)fmin(fmax(volume, 0.0), 1.0);
        player.enableRate = YES;
        player.rate = (float)fmin(fmax(rate, 0.5), 2.0);
        player.currentTime = 0;
        [player play];
    }
}

RCT_EXPORT_METHOD(setMuted:(BOOL)muted) {
    _isMuted = muted;
}

RCT_EXPORT_METHOD(stopAll) {
    for (AVAudioPlayer *player in _players.allValues) {
        [player stop];
    }
}

@end
