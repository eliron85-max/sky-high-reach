
# תיקון טופס יצירת קשר ושליחת פניות

## סקירת הבעיות
טופס יצירת הקשר לא מצליח לשלוח הודעות בגלל:
1. הטופס מנסה לקרוא ל-Edge Function בשם `resend-email`, אבל ה-Function שקיימת בפרויקט נקראת `send-inquiry-notification`
2. השדות שהטופס שולח לא תואמים למה שה-Edge Function מצפה לקבל
3. אין שילוב עם WhatsApp אחרי שליחה מוצלחת

## הפתרון המקצועי

הגישה הכי מקצועית היא:
- טופס קצר וידידותי (שם, טלפון, וואטסאפ, הודעה) - בלי אימייל מחייב
- שמירה למסד נתונים + שליחת התראה למייל האדמין
- אחרי שליחה מוצלחת - פתיחה אוטומטית של WhatsApp עם הודעה מוכנה
- הלקוח לא מקבל מייל (כי לא נדרש ממנו) - רק האדמין מקבל התראה

## שינויים מתוכננים

### 1. עדכון Edge Function (`send-inquiry-notification`)
- הסרת ולידציה על `email` ו-`projectType` (לא נדרשים יותר)
- הוספת שדה `whatsapp` לוולידציה
- שליחת מייל רק לאדמין (הלקוח לא נותן אימייל)
- התאמת תבנית המייל לשדות החדשים

### 2. עדכון טופס Contact.tsx
- שינוי הקריאה ל-Edge Function מ-`resend-email` ל-`send-inquiry-notification`
- התאמת השדות הנשלחים (הסרת שדות מיותרים)
- הוספת פתיחה אוטומטית של WhatsApp אחרי שליחה מוצלחת
- שיפור חוויית המשתמש

### 3. פתיחת WhatsApp אוטומטית
אחרי שליחה מוצלחת:
- ייפתח חלון WhatsApp חדש
- ההודעה תכיל פרטים בסיסיים (שם הלקוח ותמצית ההודעה)
- הלקוח יוכל לשלוח ישירות לנציג

## פרטים טכניים

### שינויים ב-Edge Function:
```typescript
// ולידציה מותאמת - בלי email ו-projectType
function validateInput(data: any): { valid: boolean; error?: string } {
  if (!data.fullName || data.fullName.trim().length < 2 || data.fullName.length > 100) {
    return { valid: false, error: 'Invalid name' };
  }
  if (!data.phone || data.phone.length < 9 || data.phone.length > 20) {
    return { valid: false, error: 'Invalid phone' };
  }
  if (!data.whatsapp || data.whatsapp.length < 9 || data.whatsapp.length > 20) {
    return { valid: false, error: 'Invalid whatsapp' };
  }
  if (!data.message || data.message.trim().length < 3 || data.message.length > 2000) {
    return { valid: false, error: 'Invalid message' };
  }
  return { valid: true };
}
```

### שינויים בטופס:
```typescript
// קריאה ל-Edge Function הנכון
const { error: fnError } = await supabaseUntyped.functions.invoke(
  "send-inquiry-notification", // שינוי מ-resend-email
  {
    body: {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      message: form.message.trim(),
    },
  }
);

// פתיחת WhatsApp אוטומטית אחרי הצלחה
const whatsappMessage = encodeURIComponent(
  `שלום, אני ${form.fullName}.\n` +
  `שלחתי פנייה דרך האתר: ${form.message.substring(0, 50)}...`
);
window.open(`https://wa.me/972556616326?text=${whatsappMessage}`, '_blank');
```

## סיכום

| רכיב | לפני | אחרי |
|------|------|------|
| Edge Function | מנסה לקרוא ל-`resend-email` | קורא ל-`send-inquiry-notification` |
| שדות נדרשים | email, projectType (לא קיימים בטופס) | phone, whatsapp, message |
| מייל ללקוח | לא נשלח (אין אימייל) | לא רלוונטי |
| מייל לאדמין | לא עובד | עובד עם כל הפרטים |
| WhatsApp | כפתור צף בלבד | פתיחה אוטומטית אחרי שליחה |
