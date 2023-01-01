const defaultFlags = {
    hardDeleteUsers: false,
    allowSignups: true,
  };
  
const featureService = new FeatureFlagService('https://api.example.com/flags', defaultFlags);
await featureService.initialize();

export default featureService;
