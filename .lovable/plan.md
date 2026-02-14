

## הכנסת וידאו לתוך המוקאפים

### מה ישתנה
החלפת ה-iframes בתוך המוקאפ של הלפטופ והטלפון בתגי `<video>` שמנגנים את סרטון ההירו הקיים בפרויקט (`/hero.webm`).

### פרטים טכניים

**קובץ: `src/components/LaptopMockup.tsx`**

1. **מוקאפ הלפטופ** - החלפת ה-`<iframe>` ב:
   ```html
   <video src="/hero.webm" autoPlay muted loop playsInline className="w-full h-full object-cover" />
   ```
   - הסרה של שכבת ה-overlay השקופה שהייתה חוסמת את ה-iframe

2. **מוקאפ הטלפון** - החלפת ה-`<iframe>` ב:
   ```html
   <video src="/hero.webm" autoPlay muted loop playsInline className="w-full h-full object-cover" />
   ```
   - הסרה של ה-transform/scale שהיה נדרש ל-iframe
   - הסרה של שכבת ה-overlay

### יתרונות
- ביצועים טובים יותר (ללא טעינת דף שלם בתוך iframe)
- מראה מרשים וחלק יותר
- הווידאו מתנגן אוטומטית, ללא קול, בלופ אינסופי

