import Header from "@/components/Header";
import Footer from "@/components/Footer";


import { 
  Accessibility, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const AccessibilityStatement = () => {
  const currentDate = new Date().toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      
      
      <main className="pt-header-offset lg:pt-header-offset-lg pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white mb-6">
              <Accessibility className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              הצהרת נגישות
            </h1>
            <p className="text-muted-foreground text-lg">
              עודכן לאחרונה: {currentDate}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-foreground">
            
            {/* Introduction */}
            <section className="bg-card border border-card-border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                מחויבותנו לנגישות
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                אנו מאמינים שהאינטרנט צריך להיות נגיש לכולם. אתר זה עומד בדרישות 
                תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), 
                התשע"ג-2013, ובהתאם להנחיות הנגישות לתכני אינטרנט (WCAG 2.1) 
                ברמה AA.
              </p>
            </section>

            {/* Accessibility Features */}
            <section className="bg-card border border-card-border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6">התאמות הנגישות באתר</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "שינוי גודל טקסט", desc: "אפשרות להגדיל או להקטין את גודל הטקסט" },
                  { title: "ניגודיות גבוהה", desc: "מצב ניגודיות מוגברת לקריאות טובה יותר" },
                  { title: "גווני אפור", desc: "הצגת האתר בגווני אפור לנוחות צפייה" },
                  { title: "הדגשת קישורים", desc: "סימון ברור של כל הקישורים באתר" },
                  { title: "סמן מוגדל", desc: "סמן עכבר גדול יותר לזיהוי קל" },
                  { title: "עצירת אנימציות", desc: "אפשרות לעצור תנועות ואנימציות" },
                  { title: "גופן קריא", desc: "גופן ידידותי לאנשים עם דיסלקציה" },
                  { title: "ריווח טקסט", desc: "הגדלת הריווח בין שורות ומילים" },
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Information */}
            <section className="bg-card border border-card-border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4">מידע טכני</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">תקן נגישות:</strong> WCAG 2.1 Level AA
                </p>
                <p>
                  <strong className="text-foreground">דפדפנים נתמכים:</strong> Chrome, Firefox, Safari, Edge (גרסאות עדכניות)
                </p>
                <p>
                  <strong className="text-foreground">טכנולוגיות מסייעות:</strong> האתר תומך בקוראי מסך כגון NVDA, JAWS ו-VoiceOver
                </p>
                <p>
                  <strong className="text-foreground">ניווט מקלדת:</strong> ניתן לנווט באתר באמצעות מקלדת בלבד
                </p>
              </div>
            </section>

            {/* Known Issues */}
            <section className="bg-card border border-card-border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                בעיות נגישות ידועות
              </h2>
              <p className="text-muted-foreground mb-4">
                אנו עובדים באופן שוטף לשיפור הנגישות באתר. במידה ונתקלתם בבעיית נגישות, 
                אנא פנו אלינו ונטפל בכך בהקדם האפשרי.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>ייתכנו תכנים שהועלו לאחרונה שטרם הונגשו במלואם</li>
                <li>חלק מהתמונות עשויות להיות חסרות תיאור טקסטואלי מלא</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="bg-blue-600 text-white rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6">פניות בנושא נגישות</h2>
              <p className="mb-6 opacity-90">
                נתקלתם בבעיית נגישות? יש לכם הצעות לשיפור? נשמח לשמוע מכם!
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">רכז/ת נגישות</h3>
                  <div className="space-y-3">
                    <a 
                      href="tel:+972556616326" 
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <Phone className="w-5 h-5" />
                      <span dir="ltr">055-661-6326</span>
                    </a>
                    <a 
                      href="mailto:accessibility@example.com" 
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <Mail className="w-5 h-5" />
                      <span>accessibility@example.com</span>
                    </a>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span>ישראל</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">שעות מענה</h3>
                  <p className="opacity-90">
                    ימים א'-ה': 09:00-18:00
                    <br />
                    יום ו': 09:00-13:00
                  </p>
                  <p className="text-sm opacity-75">
                    אנו מתחייבים להשיב לפניות נגישות תוך 5 ימי עסקים
                  </p>
                </div>
              </div>
            </section>

            {/* Legal Information */}
            <section className="bg-card border border-card-border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4">מסגרת חוקית</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  הצהרת נגישות זו נערכה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות 
                  (התאמות נגישות לשירות), התשע"ג-2013.
                </p>
                <p>
                  <strong className="text-foreground">חוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998</strong>
                  <br />
                  מטרת החוק היא להגן על כבודו וחירותו של אדם עם מוגבלות, ולעגן את זכותו 
                  להשתתפות שוויונית ופעילה בחברה בכל תחומי החיים.
                </p>
                <p>
                  <strong className="text-foreground">תקן ישראלי 5568</strong>
                  <br />
                  התקן הישראלי לנגישות תכנים באינטרנט מבוסס על הנחיות WCAG 2.0 
                  ברמה AA של ארגון W3C העולמי.
                </p>
              </div>
            </section>

            {/* How to Use Accessibility Menu */}
            <section className="bg-card border border-card-border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-4">כיצד להשתמש בתפריט הנגישות</h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>לחצו על כפתור הנגישות (אייקון כחול בצד שמאל של המסך)</li>
                <li>בחרו את ההתאמות הרצויות מתוך התפריט</li>
                <li>ההגדרות נשמרות אוטומטית ויישארו גם בביקורים הבאים</li>
                <li>לחזרה להגדרות ברירת המחדל, לחצו על "איפוס הגדרות"</li>
              </ol>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessibilityStatement;