import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Linking,
  Modal,
  ScrollView
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../Styling/colors';
import LottieView from "lottie-react-native";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchImagesFromFirestore, fetchSeasonData, SeasonData } from '../API/ApiHelper';
import ShortBanner from '../Components/ShortBanner';

const CUSTOM_SERVICES_FORM_URL = 'https://forms.gle/KvDgYcG8yD5Vq1Pd8';

const handleOpenServicesForm = async () => {
  try {
    const supported = await Linking.canOpenURL(CUSTOM_SERVICES_FORM_URL);
    if (supported) {
      await Linking.openURL(CUSTOM_SERVICES_FORM_URL);
    } else {
      await Linking.openURL(CUSTOM_SERVICES_FORM_URL);
    }
  } catch (err) {
    console.log('Error opening custom services form:', err);
  }
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTAINER_PAD = scale(6);
const IMAGE_MARGIN = scale(2.5);
const NUM_COLUMNS = 3;

const IMAGE_WIDTH = Math.floor(
  (SCREEN_WIDTH - CONTAINER_PAD * 2 - IMAGE_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS
);

const PAGE_SIZE = 12;

const TrendingScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState<boolean>(false);

  const navigation = useNavigation<any>();
  const hasFetched = useRef(false);

  // 🔹 Check Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected && !hasFetched.current) {
        hasFetched.current = true;
        loadAllData(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadAllData = useCallback(async (reset = false) => {
    if (!isConnected) {
      setLoading(false);
      return;
    }

    try {
      if (reset) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch SeasonData banner and SeasonImage photos in parallel
      const [bannerData, seasonImgs] = await Promise.all([
        fetchSeasonData(),
        fetchImagesFromFirestore(['SeasonImage'], reset)
      ]);

      if (bannerData) {
        setSeasonData(bannerData);
      }

      if (reset) {
        setImages(seasonImgs);
      } else {
        setImages(prev => [...prev, ...seasonImgs]);
      }

      setHasMore(seasonImgs.length >= PAGE_SIZE);
    } catch (e) {
      console.log('❌ Error loading trending data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isConnected]);

  const handleLoadMore = async () => {
    if (!hasMore || loading || loadingMore) return [];
    try {
      setLoadingMore(true);
      const more = await fetchImagesFromFirestore(['SeasonImage'], false);
      if (more.length === 0) {
        setHasMore(false);
        return [];
      } else {
        setImages(prev => [...prev, ...more]);
        if (more.length < PAGE_SIZE) {
          setHasMore(false);
        }
        return more;
      }
    } catch (e) {
      console.log('❌ Error loading more trending images:', e);
      return [];
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setHasMore(true);
    await loadAllData(true);
  };

  // ─── No Internet Screen ──────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Image style={{ height: scale(35), width: scale(35) }} source={require('../assets/no-wifi.png')} />
        <Text style={styles.noInternetText}>No Internet</Text>
      </View>
    );
  }

  // ─── Initial Loader ──────────────────────────────────────────────────────
  if (loading && images.length === 0 && !seasonData) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../assets/flashrunner.json")}
          autoPlay loop speed={1.4}
          style={{ width: scale(85), height: scale(85) }}
        />
      </View>
    );
  }


  // ─── Header: Rectangle Banner Component ──────────────────────────────────
  const renderHeader = () => {
    const bannerUri = seasonData?.imageUrl || seasonData?.simageUrl;
    const title = seasonData?.title || 'Festival Collection';
    const description = seasonData?.description?.trim() || '';

    return (
      <View style={styles.headerWrapper}>
        {/* Screen Title Bar */}
        <View style={styles.titleBar}>
          <View style={styles.titleRow}>
            <View style={styles.fireIconWrapper}>
              <Ionicons name="flame" size={scale(20)} color="#FF3B30" />
            </View>
            <Text style={styles.screenTitle}>Trending Festival</Text>
          </View>
        </View>

        {/* Rectangle Festival Banner from SeasonData */}
        {bannerUri ? (
          <View style={styles.bannerContainer}>
            <ImageBackground
              source={{ uri: bannerUri }}
              style={styles.bannerImage}
              imageStyle={styles.bannerImageStyle}
              resizeMode="cover"
            >
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0.1)',
                  'rgba(0,0,0,0.45)',
                  'rgba(0,0,0,0.85)',
                  'rgba(0,0,0,0.96)'
                ]}
                style={styles.bannerGradient}
              >
                {/* Content at bottom */}
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{title}</Text>
                  {description ? (
                    <Text style={styles.bannerDescription}>
                      {description}
                    </Text>
                  ) : null}
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        ) : null}

        {/* Compact Services Teaser Card */}
        <TouchableOpacity
          style={styles.cleanAdCard}
          activeOpacity={0.85}
          onPress={() => setIsServicesModalOpen(true)}
        >
          <LinearGradient
            colors={['#2A092A', '#16051A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cleanAdGradient}
          >
            <View style={styles.cleanAdRow}>
              <View style={styles.cleanAdIconBox}>
                <Ionicons name="sparkles" size={scale(16)} color="#E1306C" />
              </View>

              <View style={styles.cleanAdTextCol}>
                <Text style={styles.cleanAdTitle}>Custom Apps & Websites</Text>
                <Text style={styles.cleanAdSubtitle}>
                  Apps, websites, 4K wallpapers & video creation
                </Text>
              </View>

              <LinearGradient
                colors={['#833AB4', '#C13584', '#E1306C', '#FD1D1D', '#F77737']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cleanAdActionBtn}
              >
                <Text style={styles.cleanAdActionText}>Details</Text>
                <Ionicons name="chevron-forward" size={scale(11)} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Collection Section Title (Dynamic Tag from Firebase) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>
              {seasonData?.tag?.trim() || 'Exclusive Images'}
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{images.length}+ Photos</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={images}
        keyExtractor={(item, index) => `img-${index}-${item.substring(item.length - 8)}`}
        numColumns={NUM_COLUMNS}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={6}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: CONTAINER_PAD, paddingBottom: scale(20) }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() =>
              navigation.navigate('FullImageScreen', {
                imageUri: item,
                images: images,
                initialIndex: index,
                onLoadMore: handleLoadMore
              })
            }
          >
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.flashColor} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: scale(20), alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="small" color={colors.flashColor} />
            </View>
          ) : !hasMore && images.length > 0 ? (
            <View style={{ alignItems: 'center', marginVertical: scale(15) }}>
              <ShortBanner />
              <Text style={styles.endText}>You're all caught up ✨</Text>
            </View>
          ) : null
        }
      />

      {/* Full Information Modal (White Theme) */}
      <Modal
        visible={isServicesModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsServicesModalOpen(false)}
      >
        <View style={styles.sheetOverlay}>
          {/* Backdrop Tap to Close */}
          <TouchableOpacity
            style={styles.sheetBackdrop}
            activeOpacity={1}
            onPress={() => setIsServicesModalOpen(false)}
          />

          <View style={styles.sheetContent}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA', '#F8FAFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.sheetGradient}
            >
              {/* Drag Handle Indicator */}
              <View style={styles.sheetHandle} />

              {/* Sheet Header */}
              <View style={styles.sheetHeader}>
                <View style={{ flex: 1, paddingRight: scale(10) }}>
                  <Text style={styles.sheetCategory}>STUDIO SERVICES</Text>
                  <Text style={styles.sheetTitle}>Custom Development & Design</Text>
                </View>
                <TouchableOpacity
                  style={styles.sheetCloseBtn}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  onPress={() => setIsServicesModalOpen(false)}
                >
                  <Ionicons name="close" size={scale(18)} color="#475569" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sheetSubtitle}>
                Have an idea for an app, website, or custom creative media? We build it for you:
              </Text>

              {/* Services List */}
              <View style={styles.servicesGrid}>
                {/* 1. Mobile Apps */}
                <View style={styles.serviceRow}>
                  <View style={[styles.serviceIconWrap, { backgroundColor: 'rgba(193, 53, 132, 0.18)' }]}>
                    <Ionicons name="phone-portrait-outline" size={scale(17)} color="#C13584" />
                  </View>
                  <View style={styles.serviceTextCol}>
                    <Text style={styles.serviceTitle}>Mobile App Development</Text>
                    <Text style={styles.serviceDesc}>Custom Android & iOS apps with sleek UI, API integration & high speed.</Text>
                  </View>
                </View>

                {/* 2. Websites */}
                <View style={styles.serviceRow}>
                  <View style={[styles.serviceIconWrap, { backgroundColor: 'rgba(225, 48, 108, 0.18)' }]}>
                    <Ionicons name="globe-outline" size={scale(17)} color="#E1306C" />
                  </View>
                  <View style={styles.serviceTextCol}>
                    <Text style={styles.serviceTitle}>Custom Websites & Landing Pages</Text>
                    <Text style={styles.serviceDesc}>Fast, responsive business websites, portfolio pages, and web apps.</Text>
                  </View>
                </View>

                {/* 3. 4K Wallpapers & Art */}
                <View style={styles.serviceRow}>
                  <View style={[styles.serviceIconWrap, { backgroundColor: 'rgba(253, 29, 29, 0.18)' }]}>
                    <Ionicons name="color-palette-outline" size={scale(17)} color="#FD1D1D" />
                  </View>
                  <View style={styles.serviceTextCol}>
                    <Text style={styles.serviceTitle}>Custom 4K Images & Wallpapers</Text>
                    <Text style={styles.serviceDesc}>Personalized 4K wallpapers, festival collections, and branding visuals.</Text>
                  </View>
                </View>

                {/* 4. Video Creation */}
                <View style={styles.serviceRow}>
                  <View style={[styles.serviceIconWrap, { backgroundColor: 'rgba(247, 119, 55, 0.18)' }]}>
                    <Ionicons name="videocam-outline" size={scale(17)} color="#F77737" />
                  </View>
                  <View style={styles.serviceTextCol}>
                    <Text style={styles.serviceTitle}>Video Creation & Edits</Text>
                    <Text style={styles.serviceDesc}>Promotional reels, motion graphics, and cinematic video edits.</Text>
                  </View>
                </View>
              </View>

              {/* Perks Row */}
              <View style={styles.sheetPerksRow}>
                <View style={styles.sheetPerkItem}>
                  <Ionicons name="flash" size={scale(12)} color="#F77737" />
                  <Text style={styles.sheetPerkText}>Fast Turnaround</Text>
                </View>
                <View style={styles.sheetPerkItem}>
                  <Ionicons name="chatbubbles" size={scale(12)} color="#E1306C" />
                  <Text style={styles.sheetPerkText}>Free Consultation</Text>
                </View>
                <View style={styles.sheetPerkItem}>
                  <Ionicons name="checkmark-done-circle" size={scale(13)} color="#C13584" />
                  <Text style={styles.sheetPerkText}>100% Dedicated</Text>
                </View>
              </View>

              {/* Primary Action Button (Instagram Pink Gradient) */}
              <TouchableOpacity
                style={styles.sheetCtaButton}
                activeOpacity={0.85}
                onPress={() => {
                  setIsServicesModalOpen(false);
                  handleOpenServicesForm();
                }}
              >
                <LinearGradient
                  colors={['#833AB4', '#C13584', '#E1306C', '#FD1D1D', '#F77737']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sheetCtaGradient}
                >
                  <Text style={styles.sheetCtaText}>Contact Us / Get a Quote</Text>
                  <Ionicons name="arrow-forward" size={scale(14)} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    marginBottom: scale(8),
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(6),
    paddingTop: scale(8),
    paddingBottom: scale(10),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireIconWrapper: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: 'rgba(255, 69, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },
  screenTitle: {
    fontSize: scale(21),
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.3,
  },
  bannerContainer: {
    width: '100%',
    minHeight: scale(220),
    borderRadius: scale(18),
    marginVertical: scale(6),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    backgroundColor: '#1E293B',
  },
  bannerImage: {
    width: '100%',
    minHeight: scale(220),
    borderRadius: scale(18),
    overflow: 'hidden',
  },
  bannerImageStyle: {
    borderRadius: scale(18),
  },
  bannerGradient: {
    width: '100%',
    minHeight: scale(220),
    justifyContent: 'flex-end',
    borderRadius: scale(18),
    paddingHorizontal: scale(18),
    paddingTop: scale(36),
    paddingBottom: scale(18),
  },
  bannerContent: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: scale(22),
    fontWeight: '900',
    marginBottom: scale(8),
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bannerDescription: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: scale(13),
    lineHeight: scale(21),
    fontWeight: '500',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(16),
    marginBottom: scale(8),
    paddingHorizontal: scale(4),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(8),
  },
  sectionDot: {
    width: scale(3.5),
    height: scale(15),
    borderRadius: scale(2),
    backgroundColor: '#E1306C',
    marginRight: scale(7),
  },
  sectionTitle: {
    fontSize: scale(17),
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
  },
  countBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingHorizontal: scale(10),
    paddingVertical: scale(3.5),
    borderRadius: scale(10),
  },
  countText: {
    fontSize: scale(11.5),
    color: '#4B5563',
    fontWeight: '700',
  },
  image: {
    width: IMAGE_WIDTH,
    aspectRatio: 9 / 16,
    margin: IMAGE_MARGIN,
    borderRadius: scale(13),
    backgroundColor: '#D1D5DB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cleanAdCard: {
    width: '100%',
    borderRadius: scale(14),
    marginTop: scale(10),
    marginBottom: scale(4),
    borderWidth: 1,
    borderColor: 'rgba(225, 48, 108, 0.35)',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#E1306C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },
  cleanAdGradient: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    borderRadius: scale(14),
  },
  cleanAdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanAdIconBox: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(9),
    backgroundColor: 'rgba(225, 48, 108, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  cleanAdTextCol: {
    flex: 1,
    marginRight: scale(8),
  },
  cleanAdTitle: {
    fontSize: scale(12.5),
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  cleanAdSubtitle: {
    fontSize: scale(10),
    lineHeight: scale(14),
    color: '#CBD5E1',
    marginTop: scale(2),
  },
  cleanAdActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(9),
    paddingVertical: scale(4.5),
    borderRadius: scale(8),
    gap: scale(2),
  },
  cleanAdActionText: {
    color: '#FFFFFF',
    fontSize: scale(10.5),
    fontWeight: '800',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    flex: 1,
  },
  sheetContent: {
    width: '100%',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 0,
    elevation: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  sheetGradient: {
    paddingHorizontal: scale(18),
    paddingTop: scale(10),
    paddingBottom: scale(24),
  },
  sheetHandle: {
    width: scale(40),
    height: scale(4.5),
    borderRadius: scale(3),
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: scale(14),
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: scale(6),
  },
  sheetCategory: {
    fontSize: scale(10),
    fontWeight: '800',
    color: '#E1306C',
    letterSpacing: 0.8,
    marginBottom: scale(2),
  },
  sheetTitle: {
    fontSize: scale(17.5),
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  sheetCloseBtn: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetSubtitle: {
    fontSize: scale(11.5),
    lineHeight: scale(16),
    color: '#64748B',
    marginBottom: scale(12),
  },
  servicesGrid: {
    gap: scale(8),
    marginBottom: scale(12),
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(9),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1.5,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  serviceIconWrap: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(9),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(11),
  },
  serviceTextCol: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: scale(12.5),
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: scale(1.5),
  },
  serviceDesc: {
    fontSize: scale(10),
    lineHeight: scale(14),
    color: '#64748B',
  },
  sheetPerksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: scale(10),
    paddingVertical: scale(8),
    paddingHorizontal: scale(8),
    marginBottom: scale(14),
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  sheetPerkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4.5),
  },
  sheetPerkText: {
    fontSize: scale(9.5),
    fontWeight: '700',
    color: '#881337',
  },
  sheetCtaButton: {
    borderRadius: scale(12),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#E1306C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
  sheetCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    gap: scale(6),
  },
  sheetCtaText: {
    color: '#FFFFFF',
    fontSize: scale(13),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  noInternetText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: colors.redLight,
    textAlign: 'center',
    marginTop: scale(10),
  },
  endText: {
    fontSize: scale(13),
    color: '#6B7280',
    fontWeight: '600',
    marginTop: scale(10),
  },
});

export default TrendingScreen;
