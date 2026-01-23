# Visual Regression Tests

בדיקות ויזואליות אוטומטיות לזיהוי חיתוכים בהדר ובעיות רספונסיביות.

## התקנה

```bash
# התקן Playwright
npm install -D @playwright/test

# התקן דפדפנים
npx playwright install
```

## הרצה מקומית

```bash
# הרץ את כל הבדיקות
npx playwright test

# הרץ עם UI
npx playwright test --ui

# הרץ בדיקה ספציפית
npx playwright test header-mobile

# עדכן snapshots (אחרי שינוי מכוון)
npx playwright test --update-snapshots
```

## מה נבדק

### Header Mobile Tests
- **חיתוך הדר** - וידוא שכל אלמנטי ההדר נראים במלואם
- **Padding עליון** - בדיקה שה-padding לפחות 44px
- **אלמנטים קריטיים** - המבורגר, לוגו, כפתור CTA

### Viewport Sizes
- Pixel 5 (393x851) - Android Chrome טיפוסי
- Pixel 5 Small (360x640) - מסכים קטנים
- iPhone 12 - iOS רגיל
- iPhone 12 Pro Max - iOS גדול
- iPhone SE - iOS קטן
- Galaxy S9+ - Samsung

## CI/CD

הבדיקות רצות אוטומטית ב-GitHub Actions בכל push/PR ל-main.

### צפייה בתוצאות
1. לך ל-Actions tab ב-GitHub
2. בחר את ה-workflow "Visual Regression Tests"
3. הורד את ה-artifact "playwright-report"

### כשבדיקה נכשלת
1. הורד את "visual-diff-snapshots"
2. השווה בין התמונות
3. אם השינוי מכוון - הרץ `npx playwright test --update-snapshots`
