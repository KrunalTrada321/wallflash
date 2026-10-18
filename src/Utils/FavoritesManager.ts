import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "likedImages";

type FavoritesListener = (likedUris: Set<string>) => void;

class FavoritesManagerService {
  private cachedLikedImages: Set<string> | null = null;
  private initPromise: Promise<Set<string>> | null = null;
  private listeners: Set<FavoritesListener> = new Set();

  constructor() {
    this.init();
  }

  public async init(): Promise<Set<string>> {
    if (this.cachedLikedImages !== null) {
      return this.cachedLikedImages;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Deduplicate and filter out invalid/empty entries
            const valid = parsed.filter(
              (item): item is string => typeof item === "string" && item.trim().length > 0
            );
            this.cachedLikedImages = new Set(valid);
            return this.cachedLikedImages;
          }
        }
      } catch (error) {
        console.log("Error initializing FavoritesManager:", error);
      }
      this.cachedLikedImages = new Set();
      return this.cachedLikedImages;
    })().finally(() => {
      this.initPromise = null;
    });

    return this.initPromise;
  }

  public isLikedSync(uri: string | undefined | null): boolean {
    if (!uri || !this.cachedLikedImages) return false;
    return this.cachedLikedImages.has(uri);
  }

  public async isLikedAsync(uri: string | undefined | null): Promise<boolean> {
    if (!uri) return false;
    if (this.cachedLikedImages === null) {
      await this.init();
    }
    return this.cachedLikedImages?.has(uri) ?? false;
  }

  public async getLikedImages(): Promise<string[]> {
    if (this.cachedLikedImages === null) {
      await this.init();
    }
    return Array.from(this.cachedLikedImages || []);
  }

  public async toggleLike(uri: string | undefined | null): Promise<boolean> {
    if (!uri || typeof uri !== "string" || uri.trim().length === 0) {
      return false;
    }

    if (this.cachedLikedImages === null) {
      await this.init();
    }

    const currentSet = this.cachedLikedImages || new Set();
    const isCurrentlyLiked = currentSet.has(uri);
    const newSet = new Set(currentSet);

    if (isCurrentlyLiked) {
      newSet.delete(uri);
    } else {
      newSet.add(uri);
    }

    this.cachedLikedImages = newSet;
    const arrayToStore = Array.from(newSet);

    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(arrayToStore));
    } catch (error) {
      console.log("Error saving liked images to AsyncStorage:", error);
    }

    this.notifyListeners();
    return !isCurrentlyLiked;
  }

  public addListener(listener: FavoritesListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    if (this.cachedLikedImages) {
      this.listeners.forEach((listener) => {
        try {
          listener(this.cachedLikedImages!);
        } catch (e) {
          console.log("Error calling favorites listener:", e);
        }
      });
    }
  }
}

export const FavoritesManager = new FavoritesManagerService();
export default FavoritesManager;
