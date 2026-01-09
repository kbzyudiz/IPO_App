# 🎯 Quick Start Guide - New Features

## 🚀 What's New?

### 1. **Subscription Heatmap** 📊
A beautiful, animated visualization showing IPO demand across investor categories.

### 2. **Automated Data Scraper** 🤖
Fetch live GMP and subscription data from external sources automatically.

---

## 📱 How to Use

### **Step 1: View the Subscription Heatmap**

1. Open your browser to: **http://localhost:5173/**
2. Click on any IPO card (e.g., "Sanstar Ltd")
3. Scroll down to see the **Subscription Heatmap**
4. You'll see 4 animated cards showing:
   - 🔵 **Overall** - Total subscription
   - 🟣 **QIB** - Institutional buyers
   - 🟠 **NII** - Non-institutional investors
   - 🟢 **Retail** - Individual investors

**What to look for:**
- Large numbers (e.g., "5.1x") = subscription multiplier
- Animated progress bars = demand intensity
- Color gradients = visual appeal
- "LIVE TRACKING" badge = real-time data

---

### **Step 2: Refresh Live Data**

1. Navigate to the **Profile** tab (bottom navigation)
2. Look for the **"Data Sync"** section at the top
3. Click **"Refresh Live Data"**
4. Watch the refresh icon spin
5. See the timestamp update (e.g., "Just now")

**What happens:**
- App fetches latest data from Chittorgarh.com
- GMP values are updated
- Subscription numbers are refreshed
- All screens reflect new data
- Heatmap shows updated intensity

---

## 🔧 Advanced Usage

### **Using an API Key (Optional)**

If you have an API key from [ipoalerts.in](https://ipoalerts.in):

1. Open `src/App.tsx`
2. Add this code inside the `useEffect`:

```typescript
useEffect(() => {
    fetchData();
    
    // Refresh with API key
    refreshLiveData('YOUR_API_KEY_HERE');
    
    const interval = setInterval(() => {
        refreshLiveData('YOUR_API_KEY_HERE');
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
}, [fetchData, refreshLiveData]);
```

This will:
- Use the premium API instead of scraping
- Auto-refresh every hour
- Provide more reliable data

---

## 🎨 Visual Preview

The Subscription Heatmap looks like this:

![Subscription Heatmap Preview](./subscription_heatmap_preview.png)

**Key Features:**
- Glassmorphic design with blur effects
- Gradient backgrounds for each category
- Animated progress bars
- Intensity percentages
- Live tracking indicator

---

## 📊 Understanding the Data

### **Subscription Multiplier (e.g., "5.1x")**
- **1x** = Fully subscribed
- **2x** = Oversubscribed by 2 times
- **0.5x** = Only 50% subscribed
- **Higher = More demand**

### **Investor Categories:**

1. **QIB (Qualified Institutional Buyers)**
   - Mutual funds, insurance companies
   - Usually most important indicator
   - High QIB = Strong institutional interest

2. **NII (Non-Institutional Investors)**
   - HNIs (High Net Worth Individuals)
   - Corporate investors
   - Often highest subscription numbers

3. **Retail (Individual Investors)**
   - Regular investors like you and me
   - Lot size: ₹10,000 - ₹15,000
   - Most accessible category

4. **Overall**
   - Combined across all categories
   - Weighted average
   - Best single indicator

---

## ⚡ Performance Tips

### **When to Refresh:**
- ✅ Before applying to an IPO
- ✅ During subscription period (daily)
- ✅ After market hours (4 PM)
- ❌ Don't spam refresh (rate limits)

### **Best Practices:**
1. Refresh once per hour max
2. Check heatmap before investing
3. Compare categories (QIB vs Retail)
4. Look for trends (increasing/decreasing)

---

## 🐛 Troubleshooting

### **"No data available from external sources"**
**Cause:** Scraper couldn't fetch data
**Solution:** 
- Check internet connection
- Try again in a few minutes
- CORS proxy might be down
- Use manual data updates instead

### **Heatmap shows old data**
**Cause:** Refresh hasn't been triggered
**Solution:**
- Click "Refresh Live Data" in Profile
- Wait for "Just now" timestamp
- Check if subscription numbers changed

### **Refresh button keeps spinning**
**Cause:** Network timeout or error
**Solution:**
- Wait 10 seconds
- Refresh the page
- Check browser console for errors

---

## 📝 Manual Data Updates (Fallback)

If automated scraping fails, you can still update manually:

1. Open `src/data/services.ts`
2. Find `LOCAL_IPOS_RAW` array
3. Update the values:

```typescript
{
    id: 'sanstar-1',
    name: 'Sanstar Ltd',
    gmp: 22,  // ← Update GMP here
    subscription: { 
        total: 4.2,   // ← Update subscription
        retail: 5.1, 
        qib: 1.2, 
        nii: 6.8 
    }
}
```

4. Save the file
5. Vite will auto-reload the app

---

## 🎯 Next Steps

Now that you have these features:

1. **Test the heatmap** - Click through different IPOs
2. **Try refreshing** - Use the Profile screen button
3. **Monitor changes** - See how data updates
4. **Share feedback** - What else would you like?

---

## 💡 Pro Tips

1. **Best Time to Check:** 
   - Morning (10 AM) - After market opens
   - Evening (6 PM) - After market closes
   - Last day of subscription - Final numbers

2. **What to Look For:**
   - QIB > 1x = Good sign
   - Retail > 3x = High retail interest
   - NII > 10x = HNI confidence
   - Overall > 2x = Decent demand

3. **Red Flags:**
   - QIB < 0.5x = Weak institutional interest
   - All categories < 1x = Poor response
   - Declining trend = Losing momentum

---

## 📞 Need Help?

- Check `FEATURES.md` for technical details
- Review code comments in components
- Test in browser DevTools
- Check console for errors

---

**Enjoy your enhanced IPO tracking experience! 🎉**
