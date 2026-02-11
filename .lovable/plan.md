

# החלפת דמות הסנפלינג לתמונה האמיתית שהעלית

## סקירה
ניצור את קומפוננטת הגולש סנפלינג מאפס, עם התמונה האמיתית שהעלית (פועל על חבלים עם קסדה ומקדחה). התמונה כבר על רקע שקוף - מושלם לשימוש.

## שלבים

### 1. העתקת התמונה לפרויקט
- העתקת `user-uploads://Rope_Access_Worker.png` אל `src/assets/rappelling-figure.png`

### 2. יצירת קומפוננטה חדשה - `src/components/RappellingFigure.tsx`
- מיקום fixed בצד ימין של המסך
- חבל (קו אנכי) שמתחיל מראש המסך ויורד עד הדמות
- תמונת הפועל האמיתית במקום SVG
- גודל: כ-140px גובה
- תנועה למטה עם הגלילה לפי `scrollProgress`
- אנימציית נדנוד קלה (sway)
- מוסתר במובייל (`hidden lg:block`)
- `pointer-events: none` כדי לא לחסום לחיצות

### 3. עדכון `src/index.css`
- הוספת `@keyframes sway` לנדנוד קל

### 4. עדכון `src/pages/Index.tsx`
- ייבוא והוספת `RappellingFigure` לעמוד הראשי

## פרטים טכניים
- לוגיקת הגלילה: `scrollProgress = scrollY / (scrollHeight - innerHeight)`
- מיקום הדמות: `figureY = scrollProgress * (viewportHeight - 150)`
- z-index: 30 (מעל תוכן, מתחת לכפתורים צפים)
- `will-change: transform` לביצועים חלקים
- החבל הקיים בתמונה ימשיך כלפי מעלה באמצעות div עם border

## קבצים
1. **חדש**: `src/assets/rappelling-figure.png` - התמונה שהעלית
2. **חדש**: `src/components/RappellingFigure.tsx` - הקומפוננטה
3. **עדכון**: `src/index.css` - אנימציית sway
4. **עדכון**: `src/pages/Index.tsx` - הוספת הקומפוננטה

