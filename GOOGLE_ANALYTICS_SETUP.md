# Google Analytics Setup Guide

## 🚀 Quick Setup (Using @next/third-parties/google)

This implementation uses the official Next.js third-party library for optimal performance and follows Next.js best practices.

### 1. Get Your Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Add Environment Variable

Create a `.env.local` file in your project root:

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Deploy with Environment Variable

#### Vercel Deployment:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX` (your actual ID)
   - **Environment**: Production, Preview, Development

#### Other Platforms:
Make sure to set the `NEXT_PUBLIC_GA_ID` environment variable in your deployment platform.

## 📊 What's Being Tracked

### Automatic Tracking:
- ✅ **Page Views**: All page navigation
- ✅ **User Sessions**: Session duration and bounce rate
- ✅ **Device Info**: Browser, OS, device type
- ✅ **Geographic Data**: Country, city (anonymized)

### Custom Events:
- ✅ **Attendance Calculations**: When users calculate their attendance
- ✅ **Leave Configuration**: When users set up medical/duty leaves
- ✅ **Safe Bunking**: When safe bunking is calculated
- ✅ **Theme Changes**: When users switch between light/dark mode

### Event Details:

#### 1. Attendance Calculation
```javascript
Event: calculate_attendance
Category: attendance_calculator
Label: target_75% (example)
Value: total_classes_number
```

#### 2. Leave Configuration
```javascript
Event: configure_leaves
Category: leave_management
Label: medical_leaves_70%_criterion (example)
Value: number_of_leaves
```

#### 3. Safe Bunking
```javascript
Event: safe_bunking_calculated
Category: attendance_calculator
Label: can_bunk / cannot_bunk
Value: number_of_classes
```

#### 4. Attendance Status
```javascript
Event: attendance_status
Category: attendance_calculator
Label: above_target / below_target
Value: current_percentage
```

## 🔒 Privacy & Compliance

### Built-in Privacy Features:
- ✅ **IP Anonymization**: User IPs are anonymized
- ✅ **No Ad Personalization**: Disabled by default
- ✅ **No Google Signals**: Disabled for privacy
- ✅ **GDPR Compliant**: Respects user privacy

### Data Collected:
- **Anonymous usage patterns**
- **Feature usage statistics**
- **Performance metrics**
- **No personal information**

## 📈 Viewing Your Analytics

### Google Analytics Dashboard:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. View reports:
   - **Realtime**: Live user activity
   - **Audience**: User demographics and behavior
   - **Behavior**: Page views and user flow
   - **Events**: Custom event tracking

### Key Metrics to Monitor:
- **Daily Active Users**
- **Page Views per Session**
- **Average Session Duration**
- **Bounce Rate**
- **Most Popular Features**
- **User Geographic Distribution**

## 🛠️ Troubleshooting

### Analytics Not Working?

1. **Check Environment Variable**:
   ```bash
   echo $NEXT_PUBLIC_GA_ID
   ```

2. **Verify GA ID Format**:
   - Should start with `G-`
   - Example: `G-1234567890`

3. **Check Browser Console**:
   - Look for GA script loading errors
   - Verify gtag function is available

4. **Test in Production**:
   - Analytics only works in production builds
   - Use `npm run build && npm run start` to test locally

### Common Issues:

- **No data in GA**: Wait 24-48 hours for data to appear
- **Events not tracking**: Check browser console for errors
- **Wrong GA ID**: Verify the Measurement ID format

## 🎯 Advanced Configuration

### Custom Event Tracking:
```typescript
import { event } from '@/components/analytics'

// Track custom events
event({
  action: 'button_click',
  category: 'engagement',
  label: 'header_cta',
  value: 1
})
```

### Enhanced Ecommerce (Future):
If you plan to add premium features, you can track:
- Purchase events
- Subscription conversions
- Feature upgrades

## 📞 Support

If you need help with Google Analytics setup:
1. Check the [Google Analytics Help Center](https://support.google.com/analytics)
2. Verify your implementation with [Google Tag Assistant](https://tagassistant.google.com/)
3. Test events with [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger)

---

**🎉 You're all set!** Your attendance calculator will now track user engagement and help you understand how students are using your tool.
