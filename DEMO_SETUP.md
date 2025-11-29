# Demo Setup Guide

## Quick Start for Demos

Before running any demo, refresh the appointment dates to ensure they're current:

```bash
npm run refresh-dates
```

Then start your development environment:

```bash
npm run dev:all
```

## What Just Happened?

✅ All appointment dates in the mockup data are now **dynamic**
✅ You can refresh them anytime with one command
✅ Upcoming appointments: **3-7 days from today**
✅ Past appointments: **30-120 days ago**
✅ Never worry about hardcoded dates again!

## Files Changed/Created

### New Files
- `src/utils/dateGenerator.ts` - TypeScript utility functions
- `server/scripts/generateDynamicDates.js` - Node.js script to regenerate dates
- `DYNAMIC_DATES_README.md` - Complete documentation
- `DEMO_SETUP.md` - This file

### Modified Files
- `package.json` - Added `refresh-dates` npm script

## How It Works

The system automatically assigns:
- **First appointment** for each patient = Upcoming (scheduled)
- **Other appointments** = Past (completed)

This creates a realistic scenario perfect for demos.

## Complete Demo Workflow

```bash
# 1. Refresh appointment dates (makes them current)
npm run refresh-dates

# 2. Start the development server
npm run dev:all

# 3. Open http://localhost:5173 and see:
#    - Dashboard with upcoming appointments (next 3-7 days)
#    - Dashboard with past appointments (30-120 days ago)
#    - All dates relative to TODAY
```

## Customization

See `DYNAMIC_DATES_README.md` for detailed customization options including:
- Changing date ranges
- Adjusting appointment time windows
- Using the utility in your React components

## Before Each Demo

**Remember**: Run this before showing the app to anyone:

```bash
npm run refresh-dates
```

This ensures all "upcoming" appointments are genuinely in the future relative to today's date.

---

**Questions?** See DYNAMIC_DATES_README.md for complete documentation.
