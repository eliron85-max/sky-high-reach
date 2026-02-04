
# קרוסלת תמונות עם אפקט Fade פרמיום - סקציית התחדשות עירונית

## סקירה כללית
אעדכן את קומפוננטת `HomeUrbanRenewalHero` כך שתמונות הבניינים יתחלפו באפקט fade חלק ופרמיום. הקרוסלה תשמור על אותו עיצוב ומיקום מדויק של התמונות.

---

## מה ייבנה

### שינויים עיקריים:
1. **קרוסלת תמונות עם Fade** - התמונות יתחלפו באופן אוטומטי עם אפקט fade חלק במקום החלקה
2. **שימוש בתמונות הקיימות** - ננצל את כל תמונות ה-before/after שכבר קיימות בפרויקט
3. **שמירה על העיצוב** - אותו גודל, מיקום וצללים של הכרטיסיות

### רשימת תמונות לקרוסלה:
- `facade-after.jpg` / `facade-before.jpg`
- `stone-veneer-after.jpg` / `stone-veneer-before.jpg`
- `stone-veneer-after-2.jpg` / `stone-veneer-before-2.jpg`
- `stone-veneer-after-3.jpg` / `stone-veneer-before-3.jpg`

---

## פרטים טכניים

### עדכון `HomeUrbanRenewalHero.tsx`:

```text
Props החדשים:
- images: string[] - מערך של תמונות לקרוסלה
- autoplayDelay?: number - זמן בין החלפות (ברירת מחדל: 4000ms)

State פנימי:
- currentIndex: number - אינדקס התמונה הנוכחית

לוגיקה:
- useEffect עם setInterval להחלפת תמונות אוטומטית
- Fade transition באמצעות CSS transitions
```

### מבנה CSS לאפקט Fade:
```text
- שכבת תמונות absolute אחת על השנייה
- opacity transition עם duration של 700ms
- ease-in-out לתחושה פרמיום
- preload של תמונות למניעת הבהוב
```

### עדכון `Index.tsx`:
```text
- ייבוא כל התמונות הרלוונטיות
- העברת מערך תמונות לקומפוננטה במקום שני props נפרדים
```

---

## קבצים שישתנו

| קובץ | פעולה |
|------|-------|
| `src/components/HomeUrbanRenewalHero.tsx` | עדכון - הוספת לוגיקת קרוסלה עם fade |
| `src/pages/Index.tsx` | עדכון - העברת מערך תמונות |

---

## תוצאה צפויה
- התמונות יתחלפו כל 4 שניות עם אפקט fade חלק
- העיצוב הקיים נשמר לחלוטין (גודל, מיקום, צללים)
- אין כפתורי ניווט - החלפה אוטומטית בלבד
- טעינה מוקדמת של תמונות למניעת הבהוב

