import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  createCrop,
  createObservation,
  deleteCrop,
  getCrops,
  getObservations,
  getWeather,
  updateCrop,
} from './api';

const translations = {
  en: {
    tagline: 'Observe. Understand. Protect.',
    Home: 'Home', 'My Crops': 'My Crops', 'Crop Analysis': 'Crop Analysis',
    Recommendations: 'Recommendations', 'Crop History': 'Crop History',
    welcome: 'A little care goes a long way.', homeIntro: 'Your crops, their health, and what to do next — all in one calm place.',
    analyze: 'Analyze your crop', registered: 'Registered crops', observations: 'Observations saved',
    latest: 'Latest observation', weather: 'Local weather', alerts: 'A few things to check',
    noCrops: 'Your crop list is ready to grow.', noCropsBody: 'Add a field to start keeping a simple record of its growing season.',
    addCrop: 'Add a crop', addFirst: 'Register your first crop', growth: 'Growth stage',
    lastSeen: 'Last observation', noObservations: 'No observations yet', viewHistory: 'View crop history',
    cropsTitle: 'A home for every field.', cropsIntro: 'Keep the basics together and follow each crop through the season.',
    analysisTitle: 'Let’s take a closer look.', analysisIntro: 'Share what you’re seeing. A photo is saved with your notes, but no diagnosis is made unless an AI model is connected.',
    chooseCrop: 'Choose a crop', photo: 'Crop or leaf photo', symptoms: 'What are you noticing?', notes: 'Anything else you’ve noticed?',
    stage: 'Current growth stage', soil: 'Soil information', submitAnalysis: 'Save observation',
    noAI: 'Image diagnosis is not available yet. Your observation will be saved as pending, not presented as an AI result.',
    risk: 'Weather-related risk', actions: 'Helpful next steps', report: 'Observation saved',
    recommendationsTitle: 'Small, useful next steps.', recommendationsIntro: 'Suggestions are based only on what you recorded and available weather.',
    historyTitle: 'A season, one observation at a time.', historyIntro: 'Your crop’s simple digital record. Changes are only compared when the information is comparable.',
    edit: 'Edit', delete: 'Delete', cancel: 'Cancel', save: 'Save crop', fieldName: 'Farm or field name',
    cropName: 'Crop name', planted: 'Planting date', soilType: 'Soil type', location: 'Location (optional)',
    selectCrop: 'Select a crop to continue', selectPhoto: 'Choose a photo', removePhoto: 'Remove photo',
    pending: 'Image analysis pending', low: 'Low', moderate: 'Moderate', high: 'High',
    investigator: 'Crop investigator', investigatorText: 'A few simple questions can help you think through what to check next.',
    when: 'When did you first notice the symptoms?', yellow: 'Are leaves turning yellow?', spots: 'Are spots appearing on leaves?',
    rain: 'Has there been heavy rain recently?', investigate: 'Explore possible causes', possible: 'Possible things to check',
    simulator: 'What-if weather check', hypothetical: 'Hypothetical only — this is not a forecast or a prediction.',
    moreRain: 'More rainfall', humidity: 'Higher humidity', temp: 'Temperature change', delayed: 'Delay irrigation',
    estimate: 'Explore scenario', noWeather: 'Add a field location to see local weather.',
    connection: 'Can’t reach the farm record service. Start the FastAPI server to save changes.',
    noHistory: 'No crop observations have been saved yet.', deleteConfirm: 'Delete this crop and its observation history?',
    allCrops: 'All crops', symptomNone: 'No visible symptoms selected', analysisDisclaimer: 'Weather can highlight conditions to monitor; it cannot confirm a crop disease.',
    today: 'Today', healthy: 'No recent concerns recorded', loading: 'Loading your crop records…', retry: 'Try again',
    seeAll: 'See all crops', noRecommendations: 'Your saved observations will bring recommendations here.',
    weatherUnavailable: 'Weather information is unavailable right now.',
    temperature: 'Temperature', humidityLabel: 'Humidity', rainfallLabel: 'Rainfall',
  },
  hi: {
    tagline: 'देखें। समझें। बचाएं।', Home: 'होम', 'My Crops': 'मेरी फसलें', 'Crop Analysis': 'फसल विश्लेषण',
    Recommendations: 'सुझाव', 'Crop History': 'फसल इतिहास', welcome: 'थोड़ी देखभाल बड़ा बदलाव लाती है।',
    homeIntro: 'आपकी फसलें, उनका स्वास्थ्य और अगले कदम — सब एक जगह।', analyze: 'फसल का विश्लेषण करें',
    registered: 'पंजीकृत फसलें', observations: 'सहेजे गए निरीक्षण', latest: 'नवीनतम निरीक्षण', weather: 'स्थानीय मौसम',
    alerts: 'ध्यान देने योग्य बातें', noCrops: 'आपकी फसल सूची बढ़ने के लिए तैयार है।',
    noCropsBody: 'फसल का रिकॉर्ड रखने के लिए खेत जोड़ें।', addCrop: 'फसल जोड़ें', addFirst: 'पहली फसल दर्ज करें',
    growth: 'विकास अवस्था', lastSeen: 'पिछला निरीक्षण', noObservations: 'अभी कोई निरीक्षण नहीं',
    viewHistory: 'फसल इतिहास देखें', cropsTitle: 'हर खेत का अपना रिकॉर्ड।',
    cropsIntro: 'ज़रूरी जानकारी साथ रखें और मौसम भर फसल पर नज़र रखें।',
    analysisTitle: 'आइए, फसल को करीब से देखें।', analysisIntro: 'आप जो देख रहे हैं, उसे साझा करें। फोटो आपके नोट्स के साथ सहेजी जाएगी।',
    chooseCrop: 'फसल चुनें', photo: 'फसल या पत्ती की फोटो', symptoms: 'आपको क्या दिख रहा है?',
    notes: 'आपने और क्या देखा?', stage: 'वर्तमान विकास अवस्था', soil: 'मिट्टी की जानकारी',
    submitAnalysis: 'निरीक्षण सहेजें', noAI: 'फोटो से निदान अभी उपलब्ध नहीं है। आपका निरीक्षण लंबित रूप में सहेजा जाएगा।',
    risk: 'मौसम से जुड़ा जोखिम', actions: 'उपयोगी अगले कदम', report: 'निरीक्षण सहेजा गया',
    recommendationsTitle: 'छोटे, उपयोगी अगले कदम।', recommendationsIntro: 'सुझाव केवल दर्ज जानकारी और उपलब्ध मौसम पर आधारित हैं।',
    historyTitle: 'हर निरीक्षण के साथ फसल का सफर।', historyIntro: 'फसल का सरल डिजिटल रिकॉर्ड। तुलना तभी होगी जब जानकारी समान हो।',
    edit: 'बदलें', delete: 'हटाएं', cancel: 'रद्द करें', save: 'फसल सहेजें', fieldName: 'खेत का नाम',
    cropName: 'फसल का नाम', planted: 'बुआई की तारीख', soilType: 'मिट्टी का प्रकार', location: 'स्थान (वैकल्पिक)',
    selectCrop: 'जारी रखने के लिए फसल चुनें', selectPhoto: 'फोटो चुनें', removePhoto: 'फोटो हटाएं',
    pending: 'फोटो विश्लेषण लंबित', low: 'कम', moderate: 'मध्यम', high: 'अधिक',
    investigator: 'फसल सहायक', investigatorText: 'कुछ आसान सवाल आपको अगली जांच के बारे में सोचने में मदद करेंगे।',
    when: 'लक्षण पहली बार कब दिखे?', yellow: 'क्या पत्तियां पीली हो रही हैं?',
    spots: 'क्या पत्तियों पर धब्बे हैं?', rain: 'क्या हाल में तेज बारिश हुई?',
    investigate: 'संभावित कारण देखें', possible: 'जांचने योग्य संभावित बातें',
    simulator: 'मौसम की काल्पनिक जांच', hypothetical: 'यह केवल काल्पनिक स्थिति है, मौसम पूर्वानुमान नहीं।',
    moreRain: 'अधिक बारिश', humidity: 'अधिक नमी', temp: 'तापमान में बदलाव', delayed: 'सिंचाई में देरी',
    estimate: 'स्थिति देखें', noWeather: 'स्थानीय मौसम के लिए खेत का स्थान जोड़ें।',
    connection: 'फसल रिकॉर्ड सेवा से संपर्क नहीं हो रहा। बदलाव सहेजने के लिए FastAPI सर्वर शुरू करें।',
    noHistory: 'अभी तक कोई निरीक्षण सहेजा नहीं गया।', deleteConfirm: 'क्या इस फसल और उसका इतिहास हटाना चाहते हैं?',
    allCrops: 'सभी फसलें', symptomNone: 'कोई लक्षण नहीं चुना गया', analysisDisclaimer: 'मौसम केवल निगरानी में मदद करता है, बीमारी की पुष्टि नहीं।',
    today: 'आज', healthy: 'हाल में कोई चिंता दर्ज नहीं', loading: 'फसल रिकॉर्ड लोड हो रहे हैं…', retry: 'फिर कोशिश करें',
    seeAll: 'सभी फसलें देखें', noRecommendations: 'सहेजे गए निरीक्षणों के सुझाव यहां दिखाई देंगे।',
    weatherUnavailable: 'मौसम की जानकारी अभी उपलब्ध नहीं है।',
    temperature: 'तापमान', humidityLabel: 'नमी', rainfallLabel: 'बारिश',
  },
  mr: {
    tagline: 'निरीक्षण करा. समजून घ्या. संरक्षण करा.', Home: 'मुख्यपृष्ठ', 'My Crops': 'माझी पिके',
    'Crop Analysis': 'पीक निरीक्षण', Recommendations: 'सूचना', 'Crop History': 'पीक इतिहास',
    welcome: 'थोडी काळजी, मोठा फायदा.', homeIntro: 'तुमची पिके, त्यांचे आरोग्य आणि पुढील पावले — सर्व एकाच ठिकाणी.',
    analyze: 'पिकाचे निरीक्षण करा', registered: 'नोंदवलेली पिके', observations: 'जतन केलेली निरीक्षणे',
    latest: 'नवीनतम निरीक्षण', weather: 'स्थानिक हवामान', alerts: 'लक्ष देण्यासारख्या गोष्टी',
    noCrops: 'तुमची पीक यादी वाढण्यास तयार आहे.', noCropsBody: 'नोंद ठेवण्यासाठी शेत जोडा.',
    addCrop: 'पीक जोडा', addFirst: 'पहिले पीक नोंदवा', growth: 'वाढीची अवस्था',
    lastSeen: 'शेवटचे निरीक्षण', noObservations: 'अद्याप निरीक्षण नाही', viewHistory: 'पीक इतिहास पाहा',
    cropsTitle: 'प्रत्येक शेताची स्वतंत्र नोंद.', cropsIntro: 'महत्त्वाची माहिती एकत्र ठेवा आणि हंगामभर पिकावर लक्ष ठेवा.',
    analysisTitle: 'चला, पिकाचे बारकाईने निरीक्षण करूया.', analysisIntro: 'तुम्हाला काय दिसते ते सांगा. फोटो तुमच्या नोंदीसोबत जतन होईल.',
    chooseCrop: 'पीक निवडा', photo: 'पीक किंवा पानाचा फोटो', symptoms: 'तुम्हाला काय दिसत आहे?',
    notes: 'आणखी काही निरीक्षण?', stage: 'सध्याची वाढीची अवस्था', soil: 'मातीची माहिती',
    submitAnalysis: 'निरीक्षण जतन करा', noAI: 'फोटोवरून निदान अद्याप उपलब्ध नाही. निरीक्षण प्रलंबित म्हणून जतन होईल.',
    risk: 'हवामानाशी संबंधित धोका', actions: 'उपयुक्त पुढील पावले', report: 'निरीक्षण जतन झाले',
    recommendationsTitle: 'लहान, उपयुक्त पुढील पावले.', recommendationsIntro: 'सूचना फक्त नोंदवलेली माहिती आणि उपलब्ध हवामानावर आधारित आहेत.',
    historyTitle: 'प्रत्येक निरीक्षणासोबत पिकाचा प्रवास.', historyIntro: 'पिकाची सोपी डिजिटल नोंद. तुलनात्मक माहिती असल्यासच तुलना केली जाईल.',
    edit: 'बदला', delete: 'हटवा', cancel: 'रद्द करा', save: 'पीक जतन करा', fieldName: 'शेताचे नाव',
    cropName: 'पिकाचे नाव', planted: 'लागवडीची तारीख', soilType: 'मातीचा प्रकार', location: 'ठिकाण (ऐच्छिक)',
    selectCrop: 'पुढे जाण्यासाठी पीक निवडा', selectPhoto: 'फोटो निवडा', removePhoto: 'फोटो काढा',
    pending: 'फोटो विश्लेषण प्रलंबित', low: 'कमी', moderate: 'मध्यम', high: 'जास्त',
    investigator: 'पीक सहाय्यक', investigatorText: 'काही सोपे प्रश्न पुढे काय तपासावे हे ठरवण्यास मदत करतील.',
    when: 'लक्षणे पहिल्यांदा कधी दिसली?', yellow: 'पाने पिवळी होत आहेत का?',
    spots: 'पानांवर डाग आहेत का?', rain: 'अलीकडे जोरदार पाऊस झाला का?',
    investigate: 'शक्य कारणे पाहा', possible: 'तपासण्यासारख्या शक्य गोष्टी',
    simulator: 'हवामानाची काल्पनिक तपासणी', hypothetical: 'ही केवळ काल्पनिक परिस्थिती आहे, अंदाज नाही.',
    moreRain: 'अधिक पाऊस', humidity: 'अधिक आर्द्रता', temp: 'तापमानातील बदल', delayed: 'पाणी देण्यास विलंब',
    estimate: 'परिस्थिती पाहा', noWeather: 'स्थानिक हवामानासाठी शेताचे ठिकाण जोडा.',
    connection: 'पीक नोंद सेवा उपलब्ध नाही. बदल जतन करण्यासाठी FastAPI सर्व्हर सुरू करा.',
    noHistory: 'अद्याप कोणतेही निरीक्षण जतन केलेले नाही.', deleteConfirm: 'हे पीक आणि त्याचा इतिहास हटवायचा?',
    allCrops: 'सर्व पिके', symptomNone: 'कोणतीही लक्षणे निवडलेली नाहीत', analysisDisclaimer: 'हवामानामुळे लक्ष ठेवण्यास मदत होते, रोगाची खात्री होत नाही.',
    today: 'आज', healthy: 'अलीकडे कोणतीही चिंता नोंदलेली नाही', loading: 'पीक नोंदी लोड होत आहेत…', retry: 'पुन्हा प्रयत्न करा',
    seeAll: 'सर्व पिके पाहा', noRecommendations: 'जतन केलेल्या निरीक्षणांच्या सूचना येथे दिसतील.',
    weatherUnavailable: 'हवामानाची माहिती सध्या उपलब्ध नाही.',
    temperature: 'तापमान', humidityLabel: 'आर्द्रता', rainfallLabel: 'पाऊस',
  },
};

const NAV_ITEMS = [
  { label: 'Home', icon: '⌂' },
  { label: 'My Crops', icon: '♧' },
  { label: 'Crop Analysis', icon: '◉' },
  { label: 'Recommendations', icon: '✳' },
  { label: 'Crop History', icon: '◷' },
];
const STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];
const SYMPTOMS = ['Yellowing leaves', 'Spots on leaves', 'Wilting', 'Curling leaves', 'Holes or chewing', 'Unusual growth'];
const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Black soil', 'Red soil', 'Other'];

function formatDate(value, locale) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

function Icon({ children, className = '' }) {
  return <span aria-hidden="true" className={`icon ${className}`}>{children}</span>;
}

function App() {
  const [language, setLanguage] = useState('en');
  const [page, setPage] = useState('Home');
  const [crops, setCrops] = useState([]);
  const [observations, setObservations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [activeCropId, setActiveCropId] = useState('');
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [formError, setFormError] = useState('');
  const [cropModal, setCropModal] = useState(null);
  const [savedReport, setSavedReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const t = (key) => translations[language][key] || key;
  const locale = language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'mr-IN';

  const refresh = async () => {
    setLoading(true);
    try {
      const [cropData, observationData] = await Promise.all([getCrops(), getObservations()]);
      setCrops(cropData);
      setObservations(observationData);
      setOffline(false);
      setActiveCropId((current) => current || String(cropData[0]?.id || ''));
    } catch (error) {
      console.error('Unable to load crop records:', error);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const selectedCrop = useMemo(
    () => crops.find((crop) => String(crop.id) === String(activeCropId)),
    [crops, activeCropId],
  );
  const latestObservation = observations[0];
  const cropObservations = observations.filter((item) => String(item.crop_id) === String(activeCropId));

  useEffect(() => {
    let cancelled = false;
    if (!selectedCrop?.location) {
      setWeather(null);
      return () => { cancelled = true; };
    }
    getWeather(selectedCrop.location)
      .then((data) => { if (!cancelled) setWeather(data); })
      .catch((error) => {
        console.warn('Weather information unavailable:', error);
        if (!cancelled) setWeather({ unavailable: true });
      });
    return () => { cancelled = true; };
  }, [selectedCrop?.id, selectedCrop?.location]);

  const navigate = (nextPage) => {
    setFormError('');
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSaveCrop = async (data) => {
    setBusy(true);
    setFormError('');
    try {
      const saved = data.id ? await updateCrop(data.id, data) : await createCrop(data);
      await refresh();
      setActiveCropId(String(saved.id));
      setCropModal(null);
    } catch (error) {
      setFormError(error.message || 'Could not save this crop.');
    } finally {
      setBusy(false);
    }
  };

  const onDeleteCrop = async (crop) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    try {
      await deleteCrop(crop.id);
      setActiveCropId('');
      await refresh();
    } catch (error) {
      setFormError(error.message || 'Could not delete this crop.');
    }
  };

  const onSaveObservation = async (formData) => {
    setBusy(true);
    setFormError('');
    try {
      const report = await createObservation(formData.get('crop_id'), formData);
      setSavedReport(report);
      setActiveCropId(String(report.crop_id));
      await refresh();
    } catch (error) {
      setFormError(error.message || 'Could not save this observation.');
    } finally {
      setBusy(false);
    }
  };

  if (loading && !crops.length && !offline) {
    return <div className="loading-screen"><div className="brand-mark">क</div><p>{t('loading')}</p></div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('Home')} aria-label="Krishi Rakshak home">
          <span className="brand-mark">क</span>
          <span className="brand-copy"><strong>Krishi Rakshak</strong><small>{t('tagline')}</small></span>
        </button>
        <div className="header-controls">
          <label className="language-select" aria-label="Choose language">
            <Icon>◉</Icon>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option>
            </select>
          </label>
        </div>
      </header>

      <div className="page-frame">
        <nav className="main-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button key={item.label} className={`nav-item ${page === item.label ? 'active' : ''}`} onClick={() => navigate(item.label)}>
              <Icon>{item.icon}</Icon><span>{t(item.label)}</span>
            </button>
          ))}
        </nav>

        <main className="main-content">
          {offline && <div className="offline-banner"><span>{t('connection')}</span><button onClick={refresh}>{t('retry')}</button></div>}
          {formError && <div className="error-banner" role="alert">{formError}<button onClick={() => setFormError('')} aria-label="Dismiss">×</button></div>}
          {page === 'Home' && <HomePage t={t} crops={crops} observations={observations} latest={latestObservation} weather={weather} locale={locale} navigate={navigate} onAdd={() => setCropModal({})} />}
          {page === 'My Crops' && <CropsPage t={t} crops={crops} observations={observations} locale={locale} onAdd={() => setCropModal({})} onEdit={(crop) => setCropModal(crop)} onDelete={onDeleteCrop} onHistory={(id) => { setActiveCropId(String(id)); navigate('Crop History'); }} />}
          {page === 'Crop Analysis' && <AnalysisPage t={t} crops={crops} activeCropId={activeCropId} setActiveCropId={setActiveCropId} selectedCrop={selectedCrop} report={savedReport} busy={busy} error={formError} onSubmit={onSaveObservation} onAddCrop={() => setCropModal({})} />}
          {page === 'Recommendations' && <RecommendationsPage t={t} observations={observations} weather={weather} selectedCrop={selectedCrop} />}
          {page === 'Crop History' && <HistoryPage t={t} crops={crops} observations={observations} selectedCrop={selectedCrop} activeCropId={activeCropId} setActiveCropId={setActiveCropId} locale={locale} />}
          <footer className="footer-note"><span>Krishi Rakshak</span><span>{t('tagline')}</span><span>Weather is a guide, not a diagnosis.</span></footer>
        </main>
      </div>
      {cropModal && <CropModal t={t} crop={cropModal} busy={busy} onClose={() => setCropModal(null)} onSave={onSaveCrop} />}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function HomePage({ t, crops, observations, latest, weather, locale, navigate, onAdd }) {
  const alerts = latest?.recommendations || [];
  return (
    <>
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="eyebrow light">YOUR FIELD COMPANION</span>
          <h1>{t('welcome')}</h1>
          <p>{t('homeIntro')}</p>
          <button className="button button-light" onClick={() => navigate('Crop Analysis')}><Icon>◉</Icon>{t('analyze')}<span>→</span></button>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="sun-disc" /><div className="field-line field-one" /><div className="field-line field-two" />
          <span className="art-sprout">♧</span><span className="art-leaf leaf-a">◜</span><span className="art-leaf leaf-b">◝</span>
        </div>
      </section>
      <section className="summary-grid">
        <div className="summary-card"><span className="summary-icon sage"><Icon>♧</Icon></span><div><span>{t('registered')}</span><strong>{crops.length}</strong></div><button onClick={() => navigate('My Crops')}>View crops <span>→</span></button></div>
        <div className="summary-card"><span className="summary-icon yellow"><Icon>◷</Icon></span><div><span>{t('observations')}</span><strong>{observations.length}</strong></div><button onClick={() => navigate('Crop History')}>{t('viewHistory')} <span>→</span></button></div>
        <div className="summary-card weather-card"><span className="summary-icon blue"><Icon>☼</Icon></span><div><span>{t('weather')}</span><strong>{weather?.current ? `${Math.round(weather.current.temperature)}°` : '—'}</strong></div><small>{weather?.current ? `${weather.current.humidity}% humidity · ${weather.current.rainfall} mm rain` : weather?.unavailable ? t('weatherUnavailable') : t('noWeather')}</small></div>
      </section>
      <div className="content-grid home-lower">
        <section className="surface-card crop-overview">
          <div className="section-title"><div><span className="eyebrow">{t('registered')}</span><h2>{crops.length ? 'Growing with you' : t('noCrops')}</h2></div><button className="text-button" onClick={onAdd}>＋ {t('addCrop')}</button></div>
          {crops.length ? <div className="compact-crop-list">{crops.slice(0, 3).map((crop) => (
            <div className="compact-crop" key={crop.id}><span className="crop-symbol">♧</span><div><strong>{crop.name}</strong><small>{crop.field_name} · {crop.growth_stage}</small></div><span className="crop-date">{formatDate(crop.planting_date, locale)}</span></div>
          ))}<button className="wide-link" onClick={() => navigate('My Crops')}>{t('seeAll')} <span>→</span></button></div>
            : <EmptyState t={t} text={t('noCropsBody')} action={t('addFirst')} onClick={onAdd} />}
        </section>
        <section className="surface-card latest-card">
          <div className="section-title"><div><span className="eyebrow">{t('latest')}</span><h2>{latest ? latest.crop_name : t('noObservations')}</h2></div><span className={`status-pill ${latest ? 'status-pending' : 'status-ok'}`}>{latest ? t('pending') : t('healthy')}</span></div>
          {latest ? <><div className="latest-observation">{latest.image_url ? <img src={latest.image_url} alt="Latest crop observation" /> : <span className="image-placeholder">♧</span>}<div><strong>{formatDate(latest.created_at, locale)}</strong><small>{latest.symptoms?.length ? latest.symptoms.join(', ') : 'No symptoms noted'}</small></div></div><button className="wide-link" onClick={() => navigate('Crop History')}>{t('viewHistory')} <span>→</span></button></>
            : <p className="muted-copy">{t('noHistory')}</p>}
        </section>
      </div>
      {alerts.length > 0 && <section className="surface-card alert-strip"><span className="alert-symbol">✳</span><div><strong>{t('alerts')}</strong><p>{alerts[0]}</p></div><button className="text-button" onClick={() => navigate('Recommendations')}>View suggestions →</button></section>}
    </>
  );
}

function EmptyState({ t, text, action, onClick }) {
  return <div className="empty-state"><span className="empty-icon">♧</span><p>{text}</p>{action && <button className="button button-primary" onClick={onClick}>{action}</button>}</div>;
}

function CropsPage({ t, crops, observations, locale, onAdd, onEdit, onDelete, onHistory }) {
  return <>
    <PageHeading eyebrow={t('My Crops')} title={t('cropsTitle')} description={t('cropsIntro')} action={<button className="button button-primary" onClick={onAdd}>＋ {t('addCrop')}</button>} />
    {crops.length ? <div className="crop-card-grid">{crops.map((crop) => {
      const latest = observations.find((item) => item.crop_id === crop.id);
      return <article className="crop-card" key={crop.id}>
        <div className="crop-card-top"><span className="crop-illustration">♧</span><div className="crop-actions"><button title={t('edit')} onClick={() => onEdit(crop)}>✎</button><button title={t('delete')} onClick={() => onDelete(crop)}>⌫</button></div></div>
        <h2>{crop.name}</h2><p className="field-name">{crop.field_name}</p>
        <div className="crop-detail-line"><span>{t('growth')}</span><strong>{crop.growth_stage}</strong></div>
        <div className="crop-detail-line"><span>{t('planted')}</span><strong>{formatDate(crop.planting_date, locale)}</strong></div>
        <div className="crop-detail-line"><span>{t('soilType')}</span><strong>{crop.soil_type}</strong></div>
        {crop.location && <div className="crop-detail-line"><span>{t('location')}</span><strong>{crop.location}</strong></div>}
        <div className="crop-detail-line"><span>{t('lastSeen')}</span><strong>{latest ? formatDate(latest.created_at, locale) : t('noObservations')}</strong></div>
        <div className="crop-card-bottom"><span className={`status-dot ${latest ? 'pending-dot' : ''}`} />{latest ? t('pending') : t('healthy')}<button onClick={() => onHistory(crop.id)}>{t('viewHistory')} →</button></div>
      </article>;
    })}</div> : <section className="surface-card"><EmptyState t={t} text={t('noCropsBody')} action={t('addFirst')} onClick={onAdd} /></section>}
  </>;
}

function CropModal({ t, crop, busy, onClose, onSave }) {
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (!data.name.trim() || !data.field_name.trim() || !data.planting_date || !data.growth_stage || !data.soil_type) {
      setError('Please complete all required fields.'); return;
    }
    await onSave({ ...data, id: crop.id });
  };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="crop-modal-title">
    <div className="modal-heading"><div><span className="eyebrow">{crop.id ? t('edit') : t('addCrop')}</span><h2 id="crop-modal-title">{crop.id ? crop.name : t('addFirst')}</h2></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div>
    <form onSubmit={submit} className="form-grid">
      <label>{t('cropName')} *<input name="name" defaultValue={crop.name || ''} maxLength="80" required placeholder="e.g. Tomato" /></label>
      <label>{t('fieldName')} *<input name="field_name" defaultValue={crop.field_name || ''} maxLength="100" required placeholder="e.g. North field" /></label>
      <label>{t('planted')} *<input type="date" name="planting_date" defaultValue={crop.planting_date || ''} max={new Date().toISOString().slice(0, 10)} required /></label>
      <label>{t('growth')} *<select name="growth_stage" defaultValue={crop.growth_stage || STAGES[0]}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
      <label>{t('soilType')} *<select name="soil_type" defaultValue={crop.soil_type || SOIL_TYPES[0]}>{SOIL_TYPES.map((soil) => <option key={soil}>{soil}</option>)}</select></label>
      <label>{t('location')}<input name="location" defaultValue={crop.location || ''} maxLength="120" placeholder="Village or town" /></label>
      {error && <p className="form-error full-width">{error}</p>}
      <div className="modal-actions full-width"><button type="button" className="button button-quiet" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : t('save')}</button></div>
    </form>
  </section></div>;
}

function AnalysisPage({ t, crops, activeCropId, setActiveCropId, selectedCrop, report, busy, error, onSubmit, onAddCrop }) {
  const [preview, setPreview] = useState('');
  const [imageName, setImageName] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [analysisStage, setAnalysisStage] = useState(selectedCrop?.growth_stage || STAGES[0]);
  const [soilInfo, setSoilInfo] = useState(selectedCrop?.soil_type || '');
  useEffect(() => {
    setAnalysisStage(selectedCrop?.growth_stage || STAGES[0]);
    setSoilInfo(selectedCrop?.soil_type || '');
  }, [selectedCrop?.id, selectedCrop?.growth_stage, selectedCrop?.soil_type]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { event.target.value = ''; return; }
    if (file.size > 8 * 1024 * 1024) { event.target.value = ''; return; }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file)); setImageName(file.name);
  };
  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('crop_id', activeCropId);
    formData.set('symptoms', JSON.stringify(symptoms));
    onSubmit(formData);
  };
  return <>
    <PageHeading eyebrow={t('Crop Analysis')} title={t('analysisTitle')} description={t('analysisIntro')} />
    {!crops.length && <section className="surface-card no-crop-callout"><span className="crop-symbol">♧</span><p>{t('noCropsBody')}</p><button className="button button-primary" onClick={onAddCrop}>{t('addFirst')}</button></section>}
    <div className="analysis-layout">
      <form className="surface-card analysis-form" onSubmit={submit}>
        <label className="field-label">{t('chooseCrop')}<select name="crop_id" value={activeCropId} onChange={(event) => setActiveCropId(event.target.value)} required>
          <option value="">{t('selectCrop')}</option>{crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name} · {crop.field_name}</option>)}
        </select></label>
        <label className="field-label">{t('photo')}<div className={`upload-box ${preview ? 'has-preview' : ''}`}>
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" onChange={handleImage} aria-label={t('selectPhoto')} />
          {preview ? <><img src={preview} alt="Selected crop preview" /><span>{imageName}</span><button type="button" className="text-button" onClick={(event) => { event.preventDefault(); setPreview(''); setImageName(''); }}>× {t('removePhoto')}</button></>
            : <><span className="upload-icon">↑</span><strong>{t('selectPhoto')}</strong><small>JPG, PNG or WebP · up to 8 MB</small></>}
        </div></label>
        <fieldset className="symptom-fieldset"><legend>{t('symptoms')}</legend><div className="symptom-grid">{SYMPTOMS.map((symptom) =>
          <label className={`symptom-option ${symptoms.includes(symptom) ? 'selected' : ''}`} key={symptom}><input type="checkbox" checked={symptoms.includes(symptom)} onChange={() => setSymptoms((selected) => selected.includes(symptom) ? selected.filter((item) => item !== symptom) : [...selected, symptom])} />{symptom}</label>
        )}</div></fieldset>
        <div className="form-row"><label className="field-label">{t('stage')}<select name="growth_stage" value={analysisStage} onChange={(event) => setAnalysisStage(event.target.value)}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
          <label className="field-label">{t('soil')}<input name="soil_info" value={soilInfo} onChange={(event) => setSoilInfo(event.target.value)} maxLength="120" placeholder={selectedCrop?.soil_type || 'Optional'}/></label></div>
        <label className="field-label">{t('notes')}<textarea name="notes" rows="3" maxLength="1000" placeholder="For example, where on the plant you noticed it…" /></label>
        <p className="form-hint"><Icon>ⓘ</Icon>{t('noAI')}</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary submit-button" disabled={busy || !crops.length}>{busy ? <><span className="button-spinner" />Saving observation…</> : <>{t('submitAnalysis')} <span>→</span></>}</button>
      </form>
      <aside className="analysis-aside">
        {report ? <ReportCard t={t} report={report} /> : <section className="surface-card pending-card"><span className="large-soft-icon">◉</span><span className="eyebrow">{t('report')}</span><h2>{t('pending')}</h2><p>{t('noAI')}</p><div className="pending-divider" /><strong>{t('analysisDisclaimer')}</strong></section>}
        <Investigator t={t} />
      </aside>
    </div>
  </>;
}

function ReportCard({ t, report }) {
  const weatherCurrent = report.weather?.current;
  return <section className="surface-card report-card"><span className="eyebrow">{t('report')}</span><h2>{report.crop_name}</h2>
    <span className="status-pill status-pending">{t('pending')}</span>
    <p>{report.image_analysis?.message || t('noAI')}</p>
    <div className="report-section"><h3>{t('risk')}</h3><span className={`risk-chip risk-${(report.weather_risk?.level || 'unknown').toLowerCase()}`}>{report.weather_risk?.level || 'Unavailable'}</span><p>{report.weather_risk?.explanation || t('weatherUnavailable')}</p></div>
    <div className="report-section"><h3>{t('weather')}{report.weather?.location ? ` · ${report.weather.location}` : ''}</h3>
      {weatherCurrent ? <div className="weather-facts"><span>{t('temperature')} <strong>{weatherCurrent.temperature}°C</strong></span><span>{t('humidityLabel')} <strong>{weatherCurrent.humidity}%</strong></span><span>{t('rainfallLabel')} <strong>{weatherCurrent.rainfall} mm</strong></span></div> : <p>{t('weatherUnavailable')}</p>}
    </div>
    <div className="report-section"><h3>{t('actions')}</h3><ul>{(report.recommendations || []).map((action) => <li key={action}>{action}</li>)}</ul></div>
  </section>;
}

function Investigator({ t }) {
  const [answers, setAnswers] = useState({ onset: '', yellow: '', spots: '', rain: '' });
  const [show, setShow] = useState(false);
  const questions = [['onset', t('when')], ['yellow', t('yellow')], ['spots', t('spots')], ['rain', t('rain')]];
  const possible = [];
  if (answers.rain === 'yes') possible.push('Recent rain can leave leaves wet for longer. Check whether spots are spreading, and avoid watering leaves.');
  if (answers.yellow === 'yes') possible.push('Yellowing can have several causes, including water or root stress. Check whether the soil is too wet or too dry.');
  if (answers.spots === 'yes') possible.push('Note the shape and location of spots and check nearby plants for similar changes.');
  if (!possible.length) possible.push('Keep a dated note and clear photo of any changes. Many different conditions can look alike.');
  if (answers.onset) possible.push(`You first noticed the changes: ${answers.onset}. Compare the same leaves again in a few days.`);
  return <section className="surface-card investigator-card"><span className="eyebrow">{t('investigator')}</span><h2>{t('investigatorText')}</h2>
    <div className="investigator-questions">{questions.map(([key, question]) => <label key={key}>{question}<select value={answers[key]} onChange={(event) => setAnswers({ ...answers, [key]: event.target.value })}><option value="">Choose…</option>{key === 'onset' ? ['Today', 'A few days ago', 'More than a week ago'].map((option) => <option key={option}>{option}</option>) : <><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Not sure</option></>}</select></label>)}</div>
    <button className="button button-quiet" onClick={() => setShow(true)}>{t('investigate')} →</button>
    {show && <div className="possible-causes"><strong>{t('possible')}</strong><ul>{possible.map((item) => <li key={item}>{item}</li>)}</ul><small>These are checks to consider, not a confirmed diagnosis.</small></div>}
  </section>;
}

function RecommendationsPage({ t, observations, weather, selectedCrop }) {
  const [rain, setRain] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [delay, setDelay] = useState(false);
  const scenarioTemperature = weather?.current ? weather.current.temperature + Number(temperature) : null;
  const scenario = weather?.current ? Math.min(3, (weather.current.rainfall + Number(rain) >= 10 ? 1 : 0) + (weather.current.humidity + Number(humidity) >= 85 ? 1 : 0) + (scenarioTemperature >= 35 || scenarioTemperature < 10 ? 1 : 0)) : null;
  const level = scenario === null ? '' : scenario >= 2 ? 'High' : scenario === 1 ? 'Moderate' : 'Low';
  return <>
    <PageHeading eyebrow={t('Recommendations')} title={t('recommendationsTitle')} description={t('recommendationsIntro')} />
    <div className="recommendation-layout">
      <section className="surface-card recommendations-list"><span className="eyebrow">FROM YOUR FIELD NOTES</span>
        {observations.length ? observations.slice(0, 8).map((observation) => <article className="recommendation-item" key={observation.id}>
          <span className="recommendation-icon">✳</span><div><span className="recommendation-meta">{observation.crop_name} · {formatDate(observation.created_at, 'en-IN')}</span><ul>{observation.recommendations?.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </article>) : <EmptyState text={t('noRecommendations')} />}
      </section>
      <section className="surface-card simulator-card"><span className="eyebrow">{t('simulator')}</span><h2>{t('whatifTitle') || 'What might change?'}</h2><p>{t('hypothetical')}</p>
        <div className="scenario-sliders"><Slider label={t('moreRain')} value={rain} setValue={setRain} min={0} max={30} unit=" mm" /><Slider label={t('humidity')} value={humidity} setValue={setHumidity} min={0} max={20} unit="%" /><Slider label={t('temp')} value={temperature} setValue={setTemperature} min={-5} max={8} unit="°" /></div>
        <label className="toggle-row"><input type="checkbox" checked={delay} onChange={(event) => setDelay(event.target.checked)} />{t('delayed')}</label>
        <div className="scenario-result"><span>{t('risk')}{selectedCrop ? ` · ${selectedCrop.name}` : ''}</span>{scenario === null ? <p>{t('noWeather')}</p> : <><strong className={`risk-text risk-text-${level.toLowerCase()}`}>{t(level.toLowerCase())}</strong><small>Based on selected changes to current weather. This is hypothetical only.{delay ? ' Irrigation effects are not estimated without soil-moisture information.' : ''}</small></>}</div>
      </section>
    </div>
  </>;
}

function Slider({ label, value, setValue, min, max, unit }) {
  return <label className="slider-control"><span>{label}<strong>{value > 0 ? '+' : ''}{value}{unit}</strong></span><input type="range" min={min} max={max} value={value} onChange={(event) => setValue(event.target.value)} /></label>;
}

function HistoryPage({ t, crops, observations, selectedCrop, activeCropId, setActiveCropId, locale }) {
  const records = activeCropId ? observations.filter((item) => String(item.crop_id) === String(activeCropId)) : observations;
  return <>
    <PageHeading eyebrow={t('Crop History')} title={t('historyTitle')} description={t('historyIntro')} />
    <div className="history-toolbar"><label>{t('allCrops')}<select value={activeCropId} onChange={(event) => setActiveCropId(event.target.value)}><option value="">{t('allCrops')}</option>{crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name} · {crop.field_name}</option>)}</select></label>{selectedCrop && <span className="history-crop-label"><span className="crop-symbol">♧</span>{selectedCrop.name} · {selectedCrop.growth_stage}</span>}</div>
    {records.length ? <div className="timeline">{records.map((item, index) => {
      const previous = records[index + 1];
      const comparable = previous && item.symptoms?.length && previous.symptoms?.length && item.crop_id === previous.crop_id;
      const comparison = comparable ? item.symptoms.length < previous.symptoms.length ? 'Fewer symptoms noted' : item.symptoms.length > previous.symptoms.length ? 'More symptoms noted' : 'Same number of symptoms noted' : null;
      const currentSymptoms = [...(item.symptoms || [])].sort();
      const previousSymptoms = [...(previous?.symptoms || [])].sort();
      const sameSymptoms = comparable && currentSymptoms.length === previousSymptoms.length
        && currentSymptoms.every((symptom, symptomIndex) => symptom === previousSymptoms[symptomIndex]);
      const currentSubset = comparable && currentSymptoms.every((symptom) => previousSymptoms.includes(symptom));
      const previousSubset = comparable && previousSymptoms.every((symptom) => currentSymptoms.includes(symptom));
      const comparisonText = !comparable ? null
        : sameSymptoms ? 'Same symptoms noted; no change in the notes.'
          : currentSubset ? 'Fewer symptoms noted than last time; keep monitoring.'
            : previousSubset ? 'More symptoms noted than last time; consider expert advice.'
              : 'Different symptoms noted; a trend is unclear.';
      return <article className="timeline-item" key={item.id}><div className="timeline-marker" /><div className="surface-card timeline-card">
        <div className="timeline-head"><div><span className="eyebrow">{item.crop_name}{!activeCropId ? ` · ${item.field_name}` : ''}</span><h2>{formatDate(item.created_at, locale)}</h2></div><span className="status-pill status-pending">{t('pending')}</span></div>
        <div className="timeline-body">{item.image_url ? <img className="history-image" src={item.image_url} alt={`Observation of ${item.crop_name}`} /> : <span className="image-placeholder history-placeholder">♧</span>}
          <div className="timeline-details"><strong>{item.symptoms?.length ? item.symptoms.join(' · ') : t('symptomNone')}</strong><p>{item.notes || 'No additional notes.'}</p>{comparisonText && <span className="comparison-note">{comparisonText} This compares notes only, not disease severity.</span>}</div>
        </div>
        <div className="timeline-facts"><span><strong>{t('risk')}:</strong> {item.weather_risk?.level || 'Unavailable'}</span><span><strong>Image:</strong> {t('pending')}</span></div>
      </div></article>;
    })}</div> : <section className="surface-card"><EmptyState text={t('noHistory')} /></section>}
  </>;
}

export default App;
