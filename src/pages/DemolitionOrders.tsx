import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Users, Wrench, CheckCircle2, Scale, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo-new.webp";

interface FAQItem {
  question: string;
  answer: string;
}

const DemolitionOrders = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const introRef = useScrollReveal();
  const processRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const projectsRef = useScrollReveal();
  const calculatorRef = useScrollReveal();

  // Calculator state
  const [propertyType, setPropertyType] = useState("");
  const [problemType, setProblemType] = useState("");
  const [area, setArea] = useState(100);
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [needsLegal, setNeedsLegal] = useState<boolean | null>(null);
  const [urgency, setUrgency] = useState("");

  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    callbackPhone: "",
    description: "",
  });

  const scrollToContact = () => {
    const element = document.getElementById("contact-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  // Calculate estimated cost
  const estimatedCost = useMemo(() => {
    if (!propertyType || !problemType || !urgencyLevel || !urgency) {
      return null;
    }

    let baseCost = 20000;

    // Property type multiplier
    const propertyMultipliers: Record<string, number> = {
      apartment: 1,
      house: 1.5,
      commercial: 2,
      industrial: 2.5,
    };
    baseCost *= propertyMultipliers[propertyType] || 1;

    // Problem type multiplier
    const problemMultipliers: Record<string, number> = {
      minor: 1,
      structural: 2,
      major: 3,
    };
    baseCost *= problemMultipliers[problemType] || 1;

    // Area factor
    baseCost += area * 50;

    // Urgency multiplier
    const urgencyMultipliers: Record<string, number> = {
      low: 1,
      medium: 1.3,
      high: 1.6,
    };
    baseCost *= urgencyMultipliers[urgency] || 1;

    // Legal assistance
    if (needsLegal) {
      baseCost += 15000;
    }

    const minCost = Math.round(baseCost * 0.8);
    const maxCost = Math.round(baseCost * 1.2);

    return { min: minCost, max: maxCost };
  }, [propertyType, problemType, area, urgencyLevel, needsLegal, urgency]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName.trim() || !contactForm.phone.trim()) {
      toast({
        title: "שגיאה",
        description: "נא למלא שם מלא ומספר טלפון",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "הפרטים נשלחו בהצלחה!",
      description: "נחזור אליכם בהקדם",
    });
    setContactForm({
      fullName: "",
      phone: "",
      email: "",
      callbackPhone: "",
      description: "",
    });
  };

  const steps = [
    {
      icon: FileCheck,
      title: "בדיקה ראשונית",
      description: "קבלת הצו וניתוח מקיף של המצב. בדיקת תוקף הצו, סיבות ההוצאה ואפשרויות הטיפול. פגישה עם בעלי הנכס לאיסוף מידע.",
    },
    {
      icon: Shield,
      title: "סקר מקצועי",
      description: "ביצוע סקר טכני מפורט של הנכס. תיעוד צילומי של המצב הנוכחי, זיהוי כל הבעיות והסיכונים, והערכת היקף העבודות הנדרשות.",
    },
    {
      icon: Scale,
      title: "ייעוץ משפטי",
      description: "תיאום עם יועץ משפטי מומחה בתחום. הגשת התנגדות לצו במידת הצורך, והכנת חוות דעת מקצועית לבית המשפט או לרשות המקומית.",
    },
    {
      icon: Wrench,
      title: "ביצוע תיקונים",
      description: "ביצוע כל העבודות הנדרשות לפי דרישות הרשויות. עבודות שיקום, חיזוק, איטום ותיקוני בטיחות. כל העבודות מבוצעות לפי תקנים ובפיקוח מקצועי.",
    },
    {
      icon: Users,
      title: "תיאום עם רשויות",
      description: "תיאום מלא מול כל הגורמים הרלוונטיים - מחלקת הנדסה, מחלקת רישוי, פיקוח על הבנייה. הגשת כל המסמכים והאישורים הנדרשים.",
    },
    {
      icon: CheckCircle2,
      title: "סגירת התיק",
      description: "קבלת אישור סופי מהרשויות על השלמת כל התיקונים. ביטול צו ההריסה וסגירת התיק. מעקב אחר תיעוד רשמי של הביטול.",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "מהו צו הריסה ומדוע הוא מוצא?",
      answer: "צו הריסה הוא צו מנהלי שמוציאה הרשות המקומית או מחלקת הפיקוח על הבנייה כאשר מזוהה מבנה או חלק ממבנה שנבנה ללא היתר, או כאשר קיים סכנה לציבור עקב מצב המבנה. הצו מחייב את בעל הנכס לתקן את הליקויים או להרוס את המבנה בתוך פרק זמן מוגדר. צו יכול להינתן גם בגין בעיות מבניות, סיכוני קריסה, או אי עמידה בתקנות הבנייה.",
    },
    {
      question: "האם ניתן לבטל צו הריסה?",
      answer: "כן, ברוב המקרים ניתן לבטל צו הריסה על ידי ביצוע התיקונים הנדרשים ועמידה בדרישות הרשויות. התהליך כולל הגשת התנגדות לצו, ביצוע סקר מקצועי, תיקון כל הליקויים שפורטו בצו, וקבלת אישורים מהגורמים הרלוונטיים. חשוב לפעול במהירות - ככל שמתחילים לטפל מוקדם יותר, הסיכוי להצלחה גבוה יותר. במקרים מסוימים ניתן גם לקבל היתר בדיעבד למבנה שנבנה ללא היתר.",
    },
    {
      question: "כמה זמן לוקח תהליך ביטול צו הריסה?",
      answer: "משך הזמן משתנה בהתאם למורכבות המקרה והיקף העבודות הנדרשות. במקרים פשוטים, התהליך יכול להסתיים תוך 2-3 חודשים. במקרים מורכבים יותר שכוללים הליכים משפטיים או עבודות שיקום נרחבות, התהליך עשוי להימשך 6-12 חודשים. חשוב לציין שבמהלך התהליך ניתן לעתים לקבל דחיות מהרשויות, מה שמאפשר לבצע את העבודות הנדרשות ללא לחץ של ביצוע מיידי של ההריסה.",
    },
    {
      question: "מה העלות המשוערת לביטול צו הריסה?",
      answer: "העלות תלויה בהיקף העבודות הנדרשות ובמורכבות המקרה. עבודות תיקון פשוטות עשויות לעלות 20,000-50,000 ₪. פרויקטים מורכבים יותר הכוללים שיקום מבני, חיזוקים או עבודות נרחבות עשויים לעלות 100,000-300,000 ₪ ויותר. חשוב לזכור שהעלות כוללת לא רק את עבודות השיקום אלא גם חוות דעת מקצועיות, ליווי משפטי במידת הצורך, ותשלומים לרשויות. המחיר הסופי ייקבע לאחר סקר מקיף של הנכס.",
    },
    {
      question: "האם אני צריך עורך דין לביטול צו הריסה?",
      answer: "לא בהכרח בכל מקרה, אך מומלץ מאוד. במקרים פשוטים שבהם מדובר רק בתיקונים טכניים, ניתן לטפל בתהליך עם צוות מקצועי של קבלני עבודות גובה ומהנדסים. עם זאת, במקרים מורכבים, כאשר יש צורך בהגשת התנגדות לצו, כאשר מדובר במבנה ללא היתר כלל, או כאשר יש סכסוך עם הרשויות - ליווי של עורך דין מומחה בתחום הינו קריטי. אנו עובדים בשיתוף פעולה עם עורכי דין מומחים ויכולים להמליץ על הגורם המתאים.",
    },
  ];

  const relatedProjects = [
    {
      title: "שיקום מעטפת לאחר צו הריסה",
      category: "ביטול צווי הריסה",
      location: "תל אביב",
    },
    {
      title: "חיזוק קונסטרוקציה ועמידה בדרישות",
      category: "ביטול צווי הריסה",
      location: "ירושלים",
    },
    {
      title: "תיקון מבנה מסוכן וביטול צו",
      category: "ביטול צווי הריסה",
      location: "חיפה",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-header-offset lg:pt-header-offset-lg">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center bg-hero-dark overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-hero-dark/95 via-hero-dark/90 to-hero-dark/95" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mr-auto text-right">
              <div className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                שירות מקצועי וייעודי
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                ביטול צווי הריסה
                <br />
                <span className="text-primary">פתרונות מקצועיים ומהירים</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                קיבלתם צו הריסה? אנחנו כאן לעזור. עם ניסיון רב בטיפול בצווי הריסה, אנו מספקים פתרון מקיף - מייעוץ משפטי ועד לביצוע כל העבודות הנדרשות לביטול הצו.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={scrollToContact}
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-button transition-all hover:scale-105 active:scale-95"
                >
                  קבלו ייעוץ חינם
                </Button>
                <Button
                  onClick={() => {
                    const element = document.getElementById("process");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  size="lg"
                  variant="outline"
                  className="border-primary text-white hover:bg-primary/10 hover:text-white transition-all"
                >
                  כיצד אנחנו עוזרים
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section ref={introRef.ref} className={`py-16 lg:py-24 bg-secondary scroll-reveal ${introRef.isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-center">
                למה לבחור בנו לטיפול בצו הריסה?
              </h2>
              
              <div className="prose max-w-none text-right mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  צו הריסה הוא מצב מלחיץ ומורכב שדורש טיפול מקצועי ומיידי. אנו מתמחים בביטול צווי הריסה ומספקים פתרון מקיף מקצה לקצה - החל מניתוח הצו והבנת הדרישות, דרך ביצוע כל העבודות הנדרשות, ועד לסגירה מוצלחת של התיק מול הרשויות.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  הצוות שלנו משלב מומחיות בעבודות גובה עם הבנה מעמיקה של הדרישות המשפטיות והרגולטוריות. אנו עובדים בשיתוף פעולה עם מהנדסים, יועצים משפטיים ואנשי מקצוע נוספים כדי להבטיח שכל היבט של התהליך מטופל בצורה הטובה ביותר.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-card-border rounded-card p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">ניסיון מוכח</h3>
                  <p className="text-muted-foreground text-sm">
                    עשרות מקרים של ביטול צווים מוצלח
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-card p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">צוות מקצועי</h3>
                  <p className="text-muted-foreground text-sm">
                    מהנדסים, קבלנים ויועצים משפטיים
                  </p>
                </div>

                <div className="bg-card border border-card-border rounded-card p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">ליווי מלא</h3>
                  <p className="text-muted-foreground text-sm">
                    מתחילת התהליך ועד לביטול סופי
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps Section */}
        <section ref={processRef.ref} id="process" className={`py-16 lg:py-24 bg-background scroll-reveal ${processRef.isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                תהליך הטיפול בצו הריסה
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                תהליך מובנה ומקצועי שמבטיח טיפול יסודי ומוצלח
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-6 bg-card border border-card-border rounded-card p-6 hover:shadow-card-hover transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="text-primary" size={28} />
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef.ref} className={`py-16 lg:py-24 bg-secondary scroll-reveal ${faqRef.isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                שאלות נפוצות
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                תשובות לשאלות הנפוצות ביותר לגבי צווי הריסה והטיפול בהם
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card border border-card-border rounded-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-foreground flex-1">
                      {faq.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="text-primary flex-shrink-0 mr-4" size={24} />
                    ) : (
                      <ChevronDown className="text-muted-foreground flex-shrink-0 mr-4" size={24} />
                    )}
                  </button>

                  {openFAQ === index && (
                    <div className="px-6 pb-5 animate-fade-in-up">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Projects Section */}
        <section ref={projectsRef.ref} className={`py-16 lg:py-24 bg-background scroll-reveal ${projectsRef.isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                פרויקטים רלוונטיים
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                דוגמאות למקרים שטיפלנו בהם בהצלחה
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-card border border-card-border rounded-card overflow-hidden hover:shadow-card-hover transition-all group cursor-pointer"
                  onClick={() => (window.location.href = "/#projects")}
                >
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">תמונת פרויקט</p>
                  </div>
                  <div className="p-6">
                    <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {project.category}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={() => (window.location.href = "/#projects")}
                variant="outline"
                size="lg"
                className="border-primary text-foreground hover:bg-primary/10"
              >
                צפו בכל הפרויקטים
              </Button>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section 
          ref={calculatorRef.ref} 
          className={`py-16 lg:py-24 scroll-reveal ${calculatorRef.isVisible ? 'visible' : ''}`}
          style={{ background: 'linear-gradient(180deg, hsl(40 50% 88%) 0%, hsl(40 40% 82%) 100%)' }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                מחשבון עלויות לטיפול בצווי הריסה ושיקום מבנים
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                הכניסו את פרטי הנכס והבעיה - וקבלו הערכה מדויקת לפני פנייה לספק המקומי באזורכם.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Results Card - Left Side */}
                <div className="bg-[#f5f0e8] rounded-2xl p-8 border border-[#e0d5c5] order-2 lg:order-1">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <img src={logo} alt="פ.א פרויקטים וגובה" loading="lazy" decoding="async" className="h-8 w-auto" />
                    <span className="font-medium text-foreground">פ.א פרויקטים וגובה</span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
                      עלות משוערכת לטיפול בצו
                    </h3>
                    {estimatedCost ? (
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary mb-2">
                          ₪{estimatedCost.min.toLocaleString()} - ₪{estimatedCost.max.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          *ההערכה מבוססת על נתונים ממוצעים בלבד. לקבלת הצעת מחיר מדויקת יש לבצע סקר מקצועי.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xl font-semibold text-foreground mb-2">
                          מלא את הפרטים כדי לראות הערכה
                        </p>
                        <p className="text-sm text-muted-foreground">
                          *כל התמחורים הינם הערכה בלבד, לצורך קבלת הצעת מחיר מדויקת השאירו פרטים ונחזור אליכם בהקדם.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={scrollToContact}
                    className="w-full bg-[#e8dcc8] hover:bg-[#dfd0b8] text-foreground border border-[#d0c4b0] font-medium py-3"
                  >
                    קבלת הצעת מחיר מדויקת מפ.א פרויקטים וגובה
                  </Button>
                </div>

                {/* Calculator Form - Right Side */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm order-1 lg:order-2">
                  <div className="space-y-6">
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">סוג הנכס</label>
                      <div className="relative">
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="w-full p-3 pr-10 border border-gray-200 rounded-lg appearance-none bg-white text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">בחר סוג נכס</option>
                          <option value="apartment">דירה</option>
                          <option value="house">בית פרטי</option>
                          <option value="commercial">מבנה מסחרי</option>
                          <option value="industrial">מבנה תעשייתי</option>
                        </select>
                        {propertyType && (
                          <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        )}
                      </div>
                    </div>

                    {/* Problem Type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">סוג הבעיה / הצבירה</label>
                      <div className="relative">
                        <select
                          value={problemType}
                          onChange={(e) => setProblemType(e.target.value)}
                          className="w-full p-3 pr-10 border border-gray-200 rounded-lg appearance-none bg-white text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">בחר סוג בעיה</option>
                          <option value="minor">ליקויים קלים - רק עבודות תיקון בסיסיות</option>
                          <option value="structural">בעיות מבניות / חיזוק</option>
                          <option value="major">כן - השגת היתרים / ייעוץ</option>
                        </select>
                        {problemType && (
                          <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        )}
                      </div>
                    </div>

                    {/* Area Slider */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">שטח הנכס (מ"ר)</label>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">20</span>
                        <input
                          type="range"
                          min="20"
                          max="5000"
                          value={area}
                          onChange={(e) => setArea(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <span className="text-sm text-muted-foreground">5000</span>
                      </div>
                      <p className="text-center text-lg font-semibold text-primary mt-2">{area} מ"ר</p>
                    </div>

                    {/* Urgency Level Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">היקף התיקונים בהרחב</label>
                      <div className="relative">
                        <select
                          value={urgencyLevel}
                          onChange={(e) => setUrgencyLevel(e.target.value)}
                          className="w-full p-3 pr-10 border border-gray-200 rounded-lg appearance-none bg-white text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">בחר היקף תיקונים</option>
                          <option value="small">תיקונים קטנים</option>
                          <option value="medium">תיקונים בינוניים</option>
                          <option value="large">שיקום נרחב</option>
                        </select>
                        {urgencyLevel && (
                          <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        )}
                      </div>
                    </div>

                    {/* Legal Assistance */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">נדרש ליווי משפטי?</label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setNeedsLegal(false)}
                          className={`flex-1 p-3 rounded-lg border transition-all ${
                            needsLegal === false
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'border-gray-200 text-foreground hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center ${needsLegal === false ? 'border-primary' : 'border-gray-400'}">
                              {needsLegal === false && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                            </span>
                            לא - רק עבודות תיקון בסיסיות
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNeedsLegal(true)}
                          className={`flex-1 p-3 rounded-lg border transition-all ${
                            needsLegal === true
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'border-gray-200 text-foreground hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center ${needsLegal === true ? 'border-primary' : 'border-gray-400'}">
                              {needsLegal === true && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                            </span>
                            כן - השגת התנגדויות / ייעוץ
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Urgency */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">רמת הדחיפות</label>
                      <div className="relative">
                        <select
                          value={urgency}
                          onChange={(e) => setUrgency(e.target.value)}
                          className="w-full p-3 pr-10 border border-gray-200 rounded-lg appearance-none bg-white text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">בחר רמת דחיפות</option>
                          <option value="low">נמוכה - יש זמן</option>
                          <option value="medium">בינונית - תוך חודש-חודשיים</option>
                          <option value="high">גבוהה - דחוף!</option>
                        </select>
                        {urgency && (
                          <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  השאירו פרטים לקבלת הצעת מחיר מדויקת
                </h2>
                <p className="text-muted-foreground">
                  *לאחר מילוי הפרטים נחזור אליכם, נבצע את המדידות הנדרשות, נבין טוב יותר האת האתגר ונמציא הצעה מפורטת לטיפול מלא בצו ההריסה.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4 bg-white rounded-2xl p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">שם מלא *</label>
                    <Input
                      type="text"
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">טלפון *</label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">אימייל (לא חובה)</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">מספר טלפון להחזרה</label>
                    <Input
                      type="tel"
                      value={contactForm.callbackPhone}
                      onChange={(e) => setContactForm({ ...contactForm, callbackPhone: e.target.value })}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <span className="text-destructive ml-1">*</span>
                    אם תרצו סיפור בכתב
                  </label>
                  <p className="text-sm text-muted-foreground mb-2">תיאור קצר של הבעיה והנכס</p>
                  <Textarea
                    value={contactForm.description}
                    onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                    className="w-full min-h-[100px]"
                    placeholder="לדוגמא: דירה ב-5 קומות, צו הריסה כבי 6 חודשים, מבנה מגורים בצד השמאלי..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-4 text-lg"
                >
                  שליחת פרטים
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 lg:py-24 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                קיבלתם צו הריסה? נעזור לכם
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                אל תחכו - ככל שנתחיל לטפל מוקדם יותר, הסיכוי להצלחה גבוה יותר.
                צרו איתנו קשר היום לייעוץ ראשוני חינם והערכת המצב.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/#contact")}
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                >
                  צור קשר עכשיו
                </Button>
                <Button
                  onClick={() => (window.location.href = "tel:050-1234567")}
                  size="lg"
                  variant="outline"
                  className="border-primary text-foreground hover:bg-primary/10"
                >
                  התקשרו: 050-1234567
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DemolitionOrders;
