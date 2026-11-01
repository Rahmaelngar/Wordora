<p align="center"><strong>مشروع ضمن منحة لتعلّم Vibe Coding</strong></p>

<p align="center">
  <img src="artifacts/wordora-presentation/public/images/replit-logo.png" alt="شعار Replit" width="120">
</p>

<p align="center">
  <a href="https://nordpoints.com">
    <img src="artifacts/wordora-presentation/public/images/nordpoints-transparent.png" alt="شعار Nordpoints" width="190">
  </a>
</p>

<h1 align="center">Wordora</h1>

<p align="center"><em>Learn a New Language. Open a New World.</em></p>

<p align="center">إشراف <strong>Taha Mahmoud Metwally Nour El-Dein</strong></p>

<p align="center">مشروع من إنشاء <strong>Rahma Magdy Elnaggar</strong></p>

**Wordora** منصة تفاعلية لتعلّم اللغات بشرح عربي، تنقل المتعلم من أول كلمة إلى مواقف وجمل أكثر تقدّمًا. تجمع بين الدروس القصيرة، والاستماع والنطق، والاختبارات، والمراجعة، وخطة يومية تساعد على الاستمرار.

## فكرة المشروع

يختار المتعلّم لغة واحدة من الإنجليزية والفرنسية والإسبانية والألمانية والإيطالية والتركية، ثم يتدرّج عبر مستويات **A1 وA2 وB1 وB2 وC1 وC2**. تُعرض مادة الدرس عنصرًا واحدًا في كل مرة، مع المعنى بالعربية والنطق المبسّط ومثال مترجم؛ ويمكن الاستماع أو فتح الفيديو التعليمي ومراجعة الكلمات المحفوظة.

يشمل التطبيق GPT Ieon للمساعدة في فهم المفردات والقواعد، واختبارات قصيرة، ولوحة تقدم وخطة يومية. تُحتسب المكافآت بناءً على إنجاز فعلي بدلًا من الضغط على الأزرار.

## ملفات العرض

- [تحميل العرض التقديمي (PPTX)](docs/presentation/Wordora-Presentation.pptx)
- [تحميل نسخة العرض PDF](docs/presentation/Wordora-Presentation.pdf)

## التقنية والتطوير

يتكوّن المشروع من تطبيق Wordora مبني على React وVite وTypeScript، وخادم API باستخدام Express، ضمن مساحة عمل pnpm. يُستخدم تسجيل الدخول لحفظ تقدّم الحساب سحابيًا، بينما يستطيع الضيف متابعة التعلّم بحفظ محلي على جهازه. تستخدم المنصة أيضًا مخطط OpenAPI لمشاركة عقود الواجهة البرمجية بين أجزاء النظام.

### التشغيل داخل Replit

في Replit، استخدم سير العملين المُدارين الحاليين للتطبيق وخادم API. وللتطوير المحلي:

```sh
pnpm install
pnpm --filter @workspace/wordora run dev
pnpm --filter @workspace/api-server run dev
```

للتحقق من الأنواع:

```sh
pnpm run typecheck
```

للتعليمات التفصيلية وبنية المحتوى والاختبارات، راجع [دليل تطوير Wordora](artifacts/wordora/README.md) و[الدروس المستفادة من بناء الموقع](docs/lessons-learned.md).

> لا تضع مفاتيح API أو بيانات دخول في ملفات المشروع أو GitHub. استخدم Replit Secrets للإعدادات الخاصة.
