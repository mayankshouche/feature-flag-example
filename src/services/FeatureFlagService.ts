interface FeatureFlags {
    [key: string]: boolean;
  }
  
class FeatureFlagService {
    private flags: FeatureFlags = {};
    private defaultFlags: FeatureFlags = {};
    private flagServerUri: string;

    constructor(flagServerUri: string, defaultFlags: FeatureFlags) {
        this.flagServerUri = flagServerUri;
        this.defaultFlags = defaultFlags;
    }

    async initialize(): Promise<void> {
        try {
            const response = await fetch(this.flagServerUri);
            if (!response.ok) {
                throw new Error('Failed to fetch remote flags');
            }
            this.flags = await response.json();
            } catch (error) {
            console.error('Error fetching remote flags, using defaults:', error);
            this.flags = { ...this.defaultFlags };
        }
    }

    isEnabled(featureName: string): boolean {
        return this.flags[featureName] ?? this.defaultFlags[featureName] ?? false;
    }
}