import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, GitFork, Users, Calendar } from 'lucide-react';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { ManufacturerCard } from '@/components/ManufacturerCard';
import { StatsOverview } from '@/components/StatsOverview';
import { manufacturersData } from '@/data/manufacturers';
import { translations, Language } from '@/data/translations';
import { Helmet } from 'react-helmet-async';
import { useContentProtection } from '@/hooks/useContentProtection';
import DynamicWatermark from '@/components/DynamicWatermark';
import SafeExternalLink from '@/components/ExternalLink';
import { useParams } from 'react-router-dom';

interface IndexProps {
  forcedLanguage?: Language;
}

const Index: React.FC<IndexProps> = ({ forcedLanguage }) => {
  const params = useParams();
  const paramLang = params.lang as Language | undefined;

  // 支持的语言
  const supported: Language[] = ['zh', 'en', 'hi'];

  // 检查localStorage
  let storedLang: Language | null = null;
  if (typeof window !== 'undefined') {
    storedLang = (localStorage.getItem('lang') as Language) || null;
  }

  // 检查浏览器语言
  let browserLang: Language | null = null;
  if (typeof window !== 'undefined' && navigator.language) {
    const langPrefix = navigator.language.split('-')[0];
    if (supported.includes(langPrefix as Language)) {
      browserLang = langPrefix as Language;
    }
  }

  // 语言优先级：forcedLanguage > URL参数 > localStorage > 浏览器 > 默认zh
  const initialLang = forcedLanguage
    || paramLang
    || storedLang
    || browserLang
    || 'zh';

  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLang);

  // 启用内容保护
  useContentProtection({
    disableRightClick: true,
    disableKeyboardShortcuts: true,
    disableDevTools: true,
    disablePrint: true,
    showWarnings: false // 在生产环境中设为false以避免干扰用户
  });

  // 切换语言时记忆到localStorage
  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  };

  const safeTranslations = translations[currentLanguage] || translations['zh'];
  const t = { ...safeTranslations, lang: currentLanguage };
  const seo = t.seo ?? {
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    twitterCard: '',
    jsonLd: undefined
  };
  const hreflangs = [
    { lang: 'zh', url: 'https://a.zli.li/zh/' },
    { lang: 'en', url: 'https://a.zli.li/en/' },
    { lang: 'hi', url: 'https://a.zli.li/hi/' }
  ];

  return (
    <>
      <DynamicWatermark 
        text={`${t.title} - a.zli.li`}
        enabled={true}
        opacity={0.02}
      />
      <Helmet>
        <html lang={currentLanguage} />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.title + ' - Bootloader Unlock Status'} />
        <meta property="og:description" content={seo.description + (t.announcement ? ' ' + t.announcement : '')} />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin + (currentLanguage !== 'zh' ? '/' + currentLanguage + '/' : '/')} />
        <meta name="wechat-card" content="summary_large_image" />
        <meta name="twitter:card" content={seo.twitterCard || 'summary'} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        {seo.ogImage && <meta name="twitter:image" content={seo.ogImage} />}
        {hreflangs.map(h => (
          <link rel="alternate" hrefLang={h.lang} href={h.url} key={h.lang} />
        ))}
        {seo.jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(seo.jsonLd)}
          </script>
        )}
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-android-50 to-white">
        {/* 公告栏 */}
        <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-center py-2 px-4 text-sm font-medium">
          {t.announcement}
        </div>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-android-200/50 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl"></div>
                {/* LOGO预留 */}
                <div>
                  <h1 className="text-xl font-bold gradient-text">
                    {t.title}
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    {t.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <LanguageSwitch 
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                />
                <Button 
                  asChild
                  className="bg-android-gradient hover:bg-android-gradient-dark transition-all duration-300"
                >
                  <SafeExternalLink 
                    href="https://github.com/xuemian168/android-locker" 
                    className="flex items-center gap-2"
                    translations={t}
                  >
                    <Github className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.contribute}</span>
                  </SafeExternalLink>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-12 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                {t.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t.subtitle}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-android-100 text-android-800">
                  <Users className="h-4 w-4 mr-2" />
                  {t.communityMaintained}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-100 text-blue-800">
                  <Star className="h-4 w-4 mr-2" />
                  {t.contributorsWelcome}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-purple-100 text-purple-800">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t.lastDataUpdate}: 2025-06-25
                </Badge>
                
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <StatsOverview manufacturers={manufacturersData} translations={t} />

          {/* Manufacturers Grid */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">
                {t.manufacturers}
              </h3>
              <div className="text-sm text-muted-foreground">
                {manufacturersData.length} {(t.manufacturers || '').toLowerCase()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {manufacturersData.map((manufacturer, index) => (
                <ManufacturerCard
                  key={manufacturer.id}
                  manufacturer={manufacturer}
                  translations={t}
                  index={index}
                />
              ))}
            </div>
          </section>

          {/* About Section */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-android-50 to-blue-50 border-android-200/50">
              <CardHeader>
                <CardTitle className="gradient-text text-xl">
                  {t.aboutTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* 左侧原有内容 */}
                  <div className="flex-1 space-y-4 w-full">
                    <p className="text-muted-foreground">
                      {t.aboutDescription}
                    </p>
                    <div>
                      <h4 className="font-semibold mb-2 text-android-700">
                        {t.howToContribute}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t.contributeDescription}
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button 
                        asChild
                        variant="outline"
                        className="border-android-300 hover:bg-android-50"
                      >
                        <SafeExternalLink 
                          href="https://github.com/xuemian168/android-locker" 
                          className="flex items-center gap-2"
                          translations={t}
                        >
                          <GitFork className="h-4 w-4" />
                          GitHub Repository
                        </SafeExternalLink>
                      </Button>
                    </div>
                  </div>
                  {/* 右侧二维码 */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-auto">
                    <SafeExternalLink
                      href="https://buymeacoffee.com/ictrun"
                      className="block"
                      translations={t}
                    >
                      <img
                        src="/buymecoffee.png"
                        alt="Buy Me a Coffee QR"
                        className="w-40 h-40 object-contain rounded-lg border border-android-200 shadow-md bg-white"
                      />
                    </SafeExternalLink>
                    <span className="mt-2 text-sm text-muted-foreground">Buy Me a Coffee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-android-200/50 bg-white/50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t.communityMaintained} • {t.contributorsWelcome}
              </p>
              {/* <p className="text-xs text-muted-foreground">
                {t.lastDataUpdate}: {new Date().toLocaleDateString()}
              </p> */}
              <p className="text-xs text-muted-foreground mt-2">
                Powered by <SafeExternalLink href="https://www.ict.run" className="underline hover:text-android-700" translations={t}>ict.run</SafeExternalLink> @ {new Date().getFullYear()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Refer: <SafeExternalLink href="https://zli.li" className="underline hover:text-blue-700" translations={t}>zli.li - Domain Scanner</SafeExternalLink> ,<SafeExternalLink href="https://h.zli.li" className="underline hover:text-blue-700" translations={t}>Hangzhou-Lang</SafeExternalLink>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
