

# תיקון HorizontalTimeline.tsx — כיוון RTL + אופטימיזציית ביצועים

## הבעיות

1. **כיוון translateX הפוך** — שורה 62 משתמשת בערך שלילי (`-progress * maxTranslate`), אבל ב-RTL הכרטיסים צריכים לזוז מימין לשמאל, כלומר ערך חיובי.
2. **re-render מיותר בכל frame** — ה-`setProgress` בתוך scroll listener גורם ל-React לרנדר מחדש את כל הקומפוננטה בכל פריים גלילה. צריך לעבור לגישת DOM refs ישירה.

## שינויים

### קובץ: `src/components/HorizontalTimeline.tsx`

1. **שורה 62** — שינוי כיוון ה-translateX:
   - מ: `const translateX = -progress * maxTranslate;`
   - ל: `const translateX = progress * maxTranslate;`

2. **שורות 36-56** — החלפת ה-useEffect לגרסת refs ישירה עם `requestAnimationFrame` ו-`data-*` attributes:
   - שימוש ב-`document.querySelector('[data-timeline-track]')` לעדכון ישיר של ה-transform
   - שימוש ב-`document.querySelector('[data-timeline-line]')` לעדכון ישיר של רוחב הקו
   - שמירת `setProgress` רק לשימוש ב-step markers ו-card visibility (שם עדיין צריך React state)

3. **שורה 187** — הוספת `data-timeline-track` ל-div של הכרטיסים
4. **שורה 156** — הוספת `data-timeline-line` לקו ההתקדמות

## פרטים טכניים

- ה-`setProgress` נשאר כדי לעדכן את ה-step markers ואת ה-card visibility (שנשלטים על ידי React state)
- ה-transform של הכרטיסים מתעדכן ישירות דרך DOM ref — ללא re-render
- קו ההתקדמות מתעדכן ישירות דרך DOM ref
- שימוש ב-`requestAnimationFrame` עם throttling למניעת כפילויות
