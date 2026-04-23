"use client";
import { useState, useMemo, useEffect } from "react";


/* ─── DATA: Raw Measurements (rich template) ─── */
const RAW_MEASUREMENTS = [

  // ════════════════════════════════════════
  // HEART & CARDIOVASCULAR
  // ════════════════════════════════════════

  {
    id: "rhr",
    name: "Resting heart rate",

    whatIsMeasured: "How many times your heart beats per minute when you're fully at rest. Most devices measure this while you're asleep, when your body is closest to its true resting state.",
    source: "Wearable sensor",
    sourceDetail: "Ring or watch worn during sleep. Apple Watch, WHOOP, Oura, Garmin, Fitbit, Samsung. Chest straps are more accurate but rarely used for resting measurement.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Wear a device to bed. The number is there in the morning.",
    frequencyCapability: "Measured continuously overnight",
    frequencyReality: "Reported as a single daily value each morning. Most people see it when they check their morning summary.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Everyone has a rough sense that a lower resting heart rate is better. The number itself (beats per minute) is familiar from gym equipment and doctor visits.",
    examples: [
      { value: "54 bpm", meaning: "Low and healthy. Typical of someone who exercises regularly. Heart is efficient and doesn't need to work hard at rest." },
      { value: "78 bpm", meaning: "Normal for an average adult. Not a concern on its own, but if this person used to be at 62 and has been climbing for weeks, that trend is worth investigating." },
    ],
    interpretation: "Lower is generally better, but context matters. Athletic adults often sit at 45-60. Average adults at 60-80. Above 80 at rest is worth discussing with a doctor. The most useful signal is change over time: if yours has been climbing steadily for two weeks, something may be off (stress, illness, overtraining, poor sleep) even if the absolute number is still 'normal.'",

    impactability: "Takes weeks to months to change",
    impactabilityDetail: "Regular aerobic exercise is the most reliable way to lower resting heart rate over time. You won't see it drop after one run. It takes weeks to months of consistent cardio training. Stress reduction and better sleep help too, but less dramatically.",
    impactLevers: ["Regular aerobic exercise", "Better sleep", "Stress reduction", "Reducing alcohol", "Reducing caffeine"],
    timeToImpact: "Weeks to months for a meaningful shift in baseline. Short-term: a bad night's sleep or a few drinks can bump it up 5-10 bpm the next morning.",

    domains: ["Heart health", "Recovery", "Longevity"],
    healthTags: ["Cardiovascular fitness", "Overtraining detection", "Illness onset", "Mortality risk"],
    usedByScores: [
      { company: "WHOOP", score: "Recovery score, WHOOP Age (Healthspan)" },
      { company: "Oura", score: "Readiness score" },
      { company: "Garmin", score: "Body Battery, Training Readiness" },
      { company: "Apple", score: "Cardio Fitness classification" },
    ],
    whoSetsLogic: "Clinical medicine has well-established norms (60-100 bpm is the textbook normal range). Wearable companies use your personal baseline rather than population norms, which is more useful for detecting change.",

    emotionalValence: "Neutral",
    userReaction: "Most people feel good when they see a low number. A sudden spike gets attention but doesn't usually cause anxiety. This is one of the least emotionally loaded health metrics.",

    dataQuality: "Trustworthy",
    trustDetail: "Wearable resting heart rate is quite accurate, especially when measured during sleep. WHOOP has been shown to be 99.7% accurate during sleep compared to clinical equipment. One of the most reliable numbers you'll get from a consumer device.",
  },

  {
    id: "hr_active",
    name: "Active heart rate",

    whatIsMeasured: "How fast your heart beats during physical activity. This is the real-time number you see during a workout, going up as you push harder and coming down as you ease off.",
    source: "Wearable sensor",
    sourceDetail: "Watch or chest strap. Chest straps are more accurate during intense or jerky movements (like weightlifting or boxing). Wrist sensors can struggle when your arm is moving a lot.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "If you're wearing a device during exercise, it captures this automatically. You can glance at it mid-workout.",
    frequencyCapability: "Every 1-5 seconds during activity",
    frequencyReality: "Available during any tracked workout. Most people look at it a few times during exercise and review the summary after.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Higher means you're working harder. Most people intuitively understand this from gym cardio machines. Heart rate zones add complexity, but the basic number is straightforward.",
    examples: [
      { value: "142 bpm during a jog", meaning: "Moderate effort for most adults. You can probably hold a conversation but it's not easy. This is the 'aerobic zone' where you build endurance." },
      { value: "178 bpm during a sprint", meaning: "Near-max effort. You can't sustain this for long. This is the intensity where you build speed and power but also accumulate a lot of fatigue." },
    ],
    interpretation: "The useful question isn't 'is this number high or low' but 'what zone am I in?' Zones are set as percentages of your maximum heart rate. Zone 2 (moderate, conversational pace) is where most endurance benefit happens. Zone 4-5 (hard, can't talk) builds speed but needs recovery afterward.",

    impactability: "Immediate",
    impactabilityDetail: "Your active heart rate responds instantly to what you're doing. Run faster, it goes up. Slow down, it drops. Over months, the same pace produces a lower heart rate as you get fitter.",
    impactLevers: ["Exercise intensity (immediate)", "Cardiovascular fitness (long-term)", "Caffeine (acute)", "Dehydration (acute)"],
    timeToImpact: "Immediate during activity. Long-term fitness changes how high it goes for the same effort, visible over weeks to months.",

    domains: ["Activity", "Heart health"],
    healthTags: ["Exercise intensity", "Training load", "Calorie expenditure", "Cardiovascular fitness"],
    usedByScores: [
      { company: "WHOOP", score: "Strain score (0-21)" },
      { company: "Apple", score: "Exercise Ring, Active Zone Minutes" },
      { company: "Garmin", score: "Intensity Minutes, Training Load" },
      { company: "Fitbit", score: "Active Zone Minutes" },
    ],
    whoSetsLogic: "Heart rate zones follow exercise science conventions. The boundaries differ slightly by device. Some use percentage of max HR, others use heart rate reserve (the gap between resting and max). You can usually customize the zones.",

    emotionalValence: "Neutral",
    userReaction: "People generally find this motivating during workouts. Seeing the number climb feels like confirmation of effort. It's rarely stressful. The zone overlays can make some people anxious about 'training wrong' if they're always in the wrong zone.",

    dataQuality: "Trustworthy",
    trustDetail: "Accurate during steady-state cardio (running, cycling). Less reliable during activities with lots of wrist movement (CrossFit, tennis, boxing). A chest strap fixes accuracy issues but adds friction. For most people, wrist accuracy is good enough.",
  },

  {
    id: "max_hr",
    name: "Maximum heart rate observed",

    whatIsMeasured: "The highest heart rate your device has ever recorded during exercise. Used to set your personal heart rate training zones.",
    source: "Wearable sensor",
    sourceDetail: "Captured automatically during peak-effort activity by any heart rate device.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Your device records it whenever you hit a new high during a tracked workout. You don't have to do anything special, though getting a true max requires very hard effort.",
    frequencyCapability: "Updated whenever a new max is observed",
    frequencyReality: "Most people discover theirs incidentally during hard workouts. Few do a deliberate max HR test.",

    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The number itself is simple. But understanding that '220 minus your age' is just a rough guess, and that your actual max could be 10-20 bpm different, takes some explaining.",
    examples: [
      { value: "186 bpm (age 38)", meaning: "The formula (220-38) predicts 182, so this person's actual max is a bit higher than the estimate. Their training zones should be set from 186, not 182." },
      { value: "172 bpm (age 45)", meaning: "The formula predicts 175, but this person may simply not have pushed hard enough yet to find their true max. Or their actual max is genuinely lower. Hard to know without a structured test." },
    ],
    interpretation: "There's no 'good' or 'bad' max heart rate. It's genetically influenced, declines with age, and doesn't reflect fitness. A very fit person can have a lower max HR than an unfit person of the same age. Its only purpose is calibrating your training zones.",

    impactability: "Can't be changed",
    impactabilityDetail: "Max heart rate is largely genetic and declines about 1 bpm per year with age. No amount of training will raise it. It's a fixed input, not a goal.",
    impactLevers: [],
    timeToImpact: "Not applicable. This is a fixed characteristic of your body.",

    domains: ["Activity"],
    healthTags: ["Training zone calibration", "Exercise prescription"],
    usedByScores: [
      { company: "All devices", score: "Heart rate zone calculations" },
    ],
    whoSetsLogic: "Exercise physiology standards. The zones are percentages of your max, and those percentage conventions are well established. The only question is whether your max is accurate.",

    emotionalValence: "Neutral",
    userReaction: "Most people don't think about this number at all. It sits in settings. Occasionally someone is surprised their actual max is different from the formula prediction.",

    dataQuality: "Depends",
    trustDetail: "Only accurate if you've actually reached your true max during a tracked workout, which requires near-all-out effort. Many people's recorded 'max' is just the highest they've happened to go, not their actual ceiling. A formal max HR test (supervised, on a treadmill) is the gold standard but rarely done outside sports medicine.",
  },

  {
    id: "hr_recovery",
    name: "Heart rate recovery (post-exercise)",

    whatIsMeasured: "How quickly your heart rate drops after you stop exercising. Usually measured as the difference between your peak heart rate and your heart rate one or two minutes later.",
    source: "Wearable sensor",
    sourceDetail: "Calculated automatically by Apple Watch, Garmin, and WHOOP at the end of tracked workouts.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Happens automatically after any tracked workout. Just stop exercising and stand still (or sit) for a minute or two.",
    frequencyCapability: "After every tracked workout",
    frequencyReality: "Available after each session. Most people see it in their workout summary but don't actively monitor it.",

    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept is intuitive: faster recovery is better. But the actual number (a drop of 30 bpm vs. 50 bpm in one minute) requires some context to interpret. Most people don't know what a 'good' recovery looks like.",
    examples: [
      { value: "Heart rate drops 45 bpm in the first minute", meaning: "Strong recovery. This person's cardiovascular system can shift gears quickly. Associated with lower mortality risk in clinical research." },
      { value: "Heart rate drops 15 bpm in the first minute", meaning: "Slow recovery. Could mean poor cardiovascular fitness, or could mean the person was still moving around after the workout. If consistently low, worth paying attention to." },
    ],
    interpretation: "A drop of less than 12 bpm in the first minute after exercise has been linked to higher mortality risk in clinical studies. Most healthy, active adults see a drop of 25-50 bpm. The trend over months matters more than any single reading.",

    impactability: "Takes weeks to months to change",
    impactabilityDetail: "Improves with cardiovascular fitness. As your heart gets stronger and your autonomic nervous system more responsive, recovery speed improves. You won't see it change after one workout.",
    impactLevers: ["Regular aerobic exercise", "Overall cardiovascular fitness"],
    timeToImpact: "Weeks to months. Tracks with overall fitness improvement.",

    domains: ["Heart health", "Recovery", "Longevity"],
    healthTags: ["Cardiovascular fitness", "Autonomic function", "Mortality risk prediction"],
    usedByScores: [
      { company: "Apple", score: "Cardio Recovery metric in workout summaries" },
      { company: "Garmin", score: "Recovery data in workout details" },
    ],
    whoSetsLogic: "Clinical research established the 12 bpm threshold. Consumer devices don't always flag this explicitly. Apple shows the number but doesn't interpret it for you.",

    emotionalValence: "Neutral",
    userReaction: "Most people barely notice this number. Fitness enthusiasts use it as a secondary indicator of conditioning. It doesn't tend to cause anxiety or excitement.",

    dataQuality: "Trustworthy if measured correctly",
    trustDetail: "The measurement is straightforward and accurate, but only if you actually stop moving. If you keep walking around or cool down actively, the drop will be slower and the reading won't reflect your true recovery capacity. Consistency in how you measure matters.",
  },

  {
    id: "hrv",
    name: "Heart rate variability (HRV)",

    whatIsMeasured: "Your heart doesn't beat like a metronome. There are tiny differences in timing between each beat. HRV measures those differences in milliseconds. Bigger differences mean your body is relaxed and adapting well. Smaller differences mean your body is under some kind of strain.",
    source: "Wearable sensor",
    sourceDetail: "Ring or watch worn during sleep. Apple Watch, WHOOP, Oura, Garmin, Fitbit, Samsung. Clinical measurement uses ECG.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Wear a device to bed. The number appears in the morning.",
    frequencyCapability: "Measured continuously overnight",
    frequencyReality: "Reported as a daily value each morning. Most people glance at it 3-4 days a week.",

    cognitiveLoad: "Hard to understand",
    cognitiveLoadDetail: "A reading like '47ms' means nothing unless you know your personal baseline. There is no universal good number. Most people need the app to translate it into a color or score.",
    examples: [
      { value: "72 ms", meaning: "Typical for this person. Well-rested, no unusual stress. Body is recovering normally." },
      { value: "38 ms", meaning: "Well below this person's baseline. Could mean poor sleep, coming down with something, too much alcohol last night, or accumulated training stress. Worth paying attention if it stays here for 2-3 days." },
    ],
    interpretation: "Higher is generally better, but what matters is your own trend. A fit 25-year-old might normally sit at 80+. A sedentary 60-year-old might normally sit at 25-35. Both can be fine. A sustained drop of 10+ ms below your baseline over several days suggests something is off.",

    impactability: "Takes weeks to change",
    impactabilityDetail: "You can't target HRV directly. It responds to other things you do: sleeping consistently, drinking less alcohol, building fitness over time, managing stress. The action is always upstream.",
    impactLevers: ["Better sleep consistency", "Reduce alcohol", "Aerobic fitness", "Stress management", "Adequate hydration"],
    timeToImpact: "A single good night can bump it the next morning. A meaningful trend shift takes 2-4 weeks of consistent habit changes.",

    domains: ["Recovery", "Stress", "Heart health", "Longevity"],
    healthTags: ["Overtraining detection", "Illness onset", "Autonomic function", "Sleep quality", "Cardiovascular fitness"],
    usedByScores: [
      { company: "WHOOP", score: "Recovery score, WHOOP Age (Healthspan)" },
      { company: "Oura", score: "Readiness score" },
      { company: "Garmin", score: "Body Battery, Training Readiness" },
      { company: "Fitbit", score: "Daily Readiness Score" },
      { company: "Samsung", score: "Energy Score" },
    ],
    whoSetsLogic: "No universal clinical standard for consumer HRV. Each device company defines its own baseline and thresholds. The same person on WHOOP and Oura gets two different numbers because they measure at different times of night.",

    emotionalValence: "Moderate",
    userReaction: "Some people check obsessively each morning. A low reading can trigger anxiety about whether to train, which itself suppresses HRV. Many users report that tracking HRV increased their stress about stress. For most people it's interesting rather than threatening.",

    dataQuality: "Trustworthy over time",
    trustDetail: "Trends are reliable. Individual nights can bounce around. Both WHOOP and Oura validated against clinical measurement with reasonable accuracy, but proprietary processing means the consumer number is not raw HRV. Don't compare across devices. WHOOP typically reads higher than Oura for the same person.",
  },

  {
    id: "bp_systolic",
    name: "Blood pressure (systolic)",

    whatIsMeasured: "The top number in a blood pressure reading. It measures the pressure in your arteries when your heart contracts and pushes blood out. This is the more important number for predicting heart attacks and strokes, especially as you get older.",
    source: "Home device or clinical visit",
    sourceDetail: "Arm cuff at doctor's office (gold standard), home digital cuff (reliable if validated), or emerging wearable estimation (WHOOP MG, Samsung Galaxy Watch, less proven).",

    measurementEffort: "Some effort required",
    measurementEffortDetail: "At the doctor: no effort, they do it for you, but you have to be at an appointment. At home: takes about a minute with a cuff, sit still, position your arm correctly. Not hard but not passive.",
    frequencyCapability: "Can be measured anytime with a cuff",
    frequencyReality: "Most people: 2-4 times a year at doctor visits. People managing hypertension: daily or a few times a week at home.",

    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "Most adults know 120/80 is 'normal' and that higher is worse. But understanding what 138/86 means for you specifically requires knowing your age, medications, risk factors, and whether the reading is typical or an outlier.",
    examples: [
      { value: "118 mmHg", meaning: "Normal and healthy. No action needed. This is what most doctors want to see." },
      { value: "142 mmHg", meaning: "Stage 2 hypertension if consistent. A single reading this high could be white coat effect (anxiety at the doctor), caffeine, or a stressful day. If home readings are consistently here, medication or lifestyle changes are warranted." },
    ],
    interpretation: "Under 120: normal. 120-129: elevated (watch it). 130-139: Stage 1 hypertension (lifestyle changes, possibly medication). 140+: Stage 2 hypertension (medication usually recommended). A single high reading is not a diagnosis. It takes multiple readings over time to establish a pattern.",

    impactability: "Takes weeks to months to change",
    impactabilityDetail: "Medication can lower blood pressure within days to weeks. Lifestyle changes (less sodium, more exercise, weight loss, stress reduction) take weeks to months. Medication is the faster lever; lifestyle is the more sustainable one.",
    impactLevers: ["Blood pressure medication", "Reduce sodium intake", "Regular exercise", "Weight loss", "Reduce alcohol", "Stress management", "DASH diet"],
    timeToImpact: "Medication: days to weeks. Lifestyle: weeks to months. Weight loss of even 5-10 lbs can produce measurable improvement.",

    domains: ["Heart health", "Risk", "Chronic condition management"],
    healthTags: ["Cardiovascular disease", "Stroke risk", "Kidney disease", "Heart failure", "Medication effectiveness"],
    usedByScores: [
      { company: "WHOOP", score: "Blood pressure monitoring (WHOOP MG)" },
      { company: "Health plans", score: "CMS Star Ratings (BP control measure)" },
    ],
    whoSetsLogic: "The American Heart Association and American College of Cardiology set the thresholds (120/80, 130/80, 140/90). These guidelines are well-established but have shifted over time. The threshold for 'high' was lowered from 140/90 to 130/80 in 2017, which reclassified millions of people as hypertensive overnight.",

    emotionalValence: "Moderate",
    userReaction: "Most people take high blood pressure seriously because they associate it with heart attacks and strokes. But because you can't feel blood pressure (it's truly invisible), many people struggle to stay motivated about treating it. 'I feel fine' is a common reason people stop taking medication.",

    dataQuality: "Trustworthy with caveats",
    trustDetail: "Arm cuff readings are accurate and clinically validated. The challenge is variability: your blood pressure changes throughout the day, reacts to stress, caffeine, and body position. A single reading is a snapshot, not a diagnosis. Home monitoring (multiple readings over days) gives a much more reliable picture than a single office visit. Wearable BP estimation is still in early stages and not yet reliable enough for clinical decisions.",
  },

  {
    id: "bp_diastolic",
    name: "Blood pressure (diastolic)",

    whatIsMeasured: "The bottom number in a blood pressure reading. It measures the pressure in your arteries between heartbeats, when your heart is relaxed and refilling with blood.",
    source: "Home device or clinical visit",
    sourceDetail: "Same devices as systolic. Always measured and reported together as a pair (e.g., 120/80).",

    measurementEffort: "Some effort required",
    measurementEffortDetail: "Same as systolic. You get both numbers from the same measurement.",
    frequencyCapability: "Every time blood pressure is measured",
    frequencyReality: "Same as systolic. Reported alongside it.",

    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "People generally understand that the bottom number matters too, but fewer people know what it means on its own. It gets less attention than systolic, even though elevated diastolic pressure is more concerning in younger adults.",
    examples: [
      { value: "76 mmHg", meaning: "Normal and healthy." },
      { value: "94 mmHg", meaning: "Elevated. In a younger adult (under 50), this is potentially more significant than a mildly elevated systolic number. Suggests the blood vessels are under strain even when the heart is at rest." },
    ],
    interpretation: "Under 80: normal. 80-89: Stage 1 hypertension. 90+: Stage 2 hypertension. In older adults, it's common for systolic to be high while diastolic is normal or even low (called isolated systolic hypertension). In younger adults, diastolic elevation can appear first.",

    impactability: "Takes weeks to months to change",
    impactabilityDetail: "Same levers as systolic. Medication, sodium reduction, exercise, weight loss. Responds to the same interventions.",
    impactLevers: ["Same as systolic blood pressure"],
    timeToImpact: "Same as systolic.",

    domains: ["Heart health", "Risk", "Chronic condition management"],
    healthTags: ["Cardiovascular disease", "Kidney disease", "Arterial stiffness"],
    usedByScores: [
      { company: "Health plans", score: "CMS Star Ratings (BP control measure, paired with systolic)" },
    ],
    whoSetsLogic: "Same AHA/ACC guidelines as systolic. Always interpreted as a pair.",

    emotionalValence: "Neutral",
    userReaction: "Most people focus on the top number and give the bottom number less attention. Few people have strong reactions to diastolic specifically.",

    dataQuality: "Trustworthy with caveats",
    trustDetail: "Same accuracy and variability considerations as systolic. Measured simultaneously.",
  },

  {
    id: "spo2",
    name: "Blood oxygen saturation (SpO2)",

    whatIsMeasured: "The percentage of your red blood cells that are carrying oxygen. It's a measure of how well your lungs are doing their job of getting oxygen into your bloodstream.",
    source: "Wearable sensor",
    sourceDetail: "Wrist or finger optical sensor. Standalone finger pulse oximeters (the clip-on kind you may have used during COVID) are more accurate than wrist-based devices.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Wearables measure it automatically overnight. Finger oximeters take a few seconds of holding still.",
    frequencyCapability: "Continuously overnight; spot checks during the day",
    frequencyReality: "Most people never look at this unless they have a respiratory condition or are at high altitude.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A percentage. 95-100% is normal. Below 90% is a medical concern. Very simple to interpret.",
    examples: [
      { value: "97%", meaning: "Normal. Lungs are working fine. Oxygen delivery is healthy." },
      { value: "88% overnight (repeated dips)", meaning: "Concerning. Repeated drops during sleep can indicate sleep apnea, where your airway partially closes and your oxygen dips repeatedly. Worth discussing with a doctor if this pattern shows up consistently." },
    ],
    interpretation: "95-100%: normal. 90-94%: low, may need attention. Below 90%: seek medical evaluation. For most healthy people, this number stays boringly normal and isn't something to check daily. It becomes important for people with respiratory conditions, sleep apnea, or at high altitude.",

    impactability: "Depends on the cause",
    impactabilityDetail: "If low due to a treatable condition (sleep apnea: CPAP fixes it quickly; pneumonia: treatment restores it), it can improve dramatically. If low due to chronic lung disease, the trajectory is different. For healthy people, it's already normal and there's nothing to 'improve.'",
    impactLevers: ["CPAP for sleep apnea", "Treatment of respiratory infections", "Altitude acclimatization", "Smoking cessation"],
    timeToImpact: "CPAP: immediate improvement on first night. Infection treatment: days. Altitude acclimatization: 1-3 days. Smoking cessation: weeks to months.",

    domains: ["Heart health", "Sleep", "Risk"],
    healthTags: ["Sleep apnea", "Respiratory health", "Altitude adaptation", "COVID/illness monitoring"],
    usedByScores: [
      { company: "Apple", score: "Blood Oxygen app (on-demand and background readings)" },
      { company: "Garmin", score: "Pulse Ox (overnight tracking)" },
    ],
    whoSetsLogic: "Clinical medicine has clear thresholds (95%+ normal, below 90% concerning). These are well-established and not disputed. Consumer devices use the same thresholds.",

    emotionalValence: "Neutral for most; high for respiratory patients",
    userReaction: "Healthy people find this boring (it's always 96-99%). People with lung conditions or sleep apnea find it genuinely useful and sometimes alarming. During COVID, SpO2 tracking became temporarily anxiety-inducing for many people. That anxiety has mostly subsided.",

    dataQuality: "Moderate",
    trustDetail: "Finger oximeters are clinically reliable. Wrist-based readings are less accurate, especially for people with darker skin tones, cold hands, tattoos over the sensor, or during movement. Overnight trends are more useful than spot checks. If a wrist reading looks concerning, confirm with a finger oximeter.",
  },

  {
    id: "resp_rate",
    name: "Respiratory rate (during sleep)",

    whatIsMeasured: "How many breaths you take per minute while sleeping. Your body breathes automatically, and the rate changes based on how hard your body is working to recover.",
    source: "Wearable sensor",
    sourceDetail: "Derived from accelerometer and heart rate patterns by WHOOP, Oura, Garmin, and Apple Watch during sleep. Not measured directly (no airflow sensor), but estimated reliably.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Measured automatically during sleep. Shows up in your morning data.",
    frequencyCapability: "Every night during sleep",
    frequencyReality: "Reported daily. Most people never look at this specifically unless an app highlights it as unusual.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Breaths per minute. Lower is calmer. Higher means your body is working harder. Simple concept.",
    examples: [
      { value: "14 breaths/min", meaning: "Normal. Body is at rest and breathing easily. Nothing to note." },
      { value: "19 breaths/min (up from usual 13-14)", meaning: "Elevated compared to this person's baseline. Their body may be fighting off an infection, or they may have trained unusually hard. If it stays elevated for 2-3 nights, they might be getting sick." },
    ],
    interpretation: "Normal adult range during sleep is 12-20 breaths per minute. Most healthy adults sit at 12-16. The signal isn't in the absolute number but in the change. A jump of 3-4 breaths above your baseline, sustained over multiple nights, is one of the earliest signals of illness, sometimes appearing before you feel symptoms.",

    impactability: "Not directly changeable",
    impactabilityDetail: "You don't consciously control your breathing rate during sleep. It responds to what's happening in your body: illness, fitness level, altitude, stress. Improving cardiovascular fitness can lower it slightly over time.",
    impactLevers: ["Aerobic fitness (slight, long-term)", "Treating illness", "Managing stress"],
    timeToImpact: "Not something you target. It's an indicator, not a goal.",

    domains: ["Sleep", "Recovery", "Risk"],
    healthTags: ["Illness detection", "Overtraining", "Sleep quality"],
    usedByScores: [
      { company: "WHOOP", score: "Health Monitor alerts" },
      { company: "Oura", score: "Readiness contributors" },
    ],
    whoSetsLogic: "Clinical medicine defines the normal range. Consumer devices flag deviations from your personal baseline rather than using absolute thresholds.",

    emotionalValence: "Neutral",
    userReaction: "Most people don't have any reaction to this number. It's background data. But when an app uses it to predict illness ('you might be getting sick'), people pay attention and often find it impressively accurate.",

    dataQuality: "Trustworthy",
    trustDetail: "Estimated rather than directly measured, but the estimation is reliable. Wearable respiratory rate during sleep tracks well against clinical measurement. One of the more dependable derived metrics.",
  },

  {
    id: "skin_temp",
    name: "Skin temperature (deviation from baseline)",

    whatIsMeasured: "The temperature of your skin at the wrist or finger, tracked continuously overnight. Reported as how much it differs from your personal average, not as an absolute temperature. A shift of +1 or +2 degrees from your norm can signal that something is changing in your body.",
    source: "Wearable sensor",
    sourceDetail: "Temperature sensor (thermistor) in Oura Ring, WHOOP, some Garmin devices. Not the same as a thermometer under your tongue. Tracks relative changes from your baseline, not absolute body temperature.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Measured automatically overnight. Deviation from baseline appears in your morning data.",
    frequencyCapability: "Continuously overnight",
    frequencyReality: "Daily deviation reported each morning. Most people only notice when the app flags a significant shift.",

    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept of deviation from baseline is slightly abstract. People are used to thermometer readings (98.6°F). Seeing '+0.8°C from baseline' requires a different mental model. Once you understand it's about change, not absolute temperature, it makes sense.",
    examples: [
      { value: "+0.1°C from baseline", meaning: "Normal fluctuation. Nothing notable. Bodies vary slightly night to night." },
      { value: "+1.8°C from baseline, sustained for 2 nights", meaning: "Your body temperature is notably elevated compared to your norm. Common causes: you're coming down with something (this can appear 1-2 days before symptoms), you're in the luteal phase of your menstrual cycle (temperature naturally rises after ovulation), or you trained very hard and your body is working to recover." },
    ],
    interpretation: "Small fluctuations (within 0.5°C of baseline) are normal and uninteresting. Deviations of 1°C or more, especially sustained over multiple nights, are meaningful. The two most common useful signals: early illness detection and menstrual cycle tracking (ovulation causes a clear temperature shift).",

    impactability: "Not directly changeable",
    impactabilityDetail: "This is an indicator, not something you try to move. It reflects what your body is doing internally: fighting infection, cycling hormones, recovering from exertion. You respond to the signal, not try to change the signal itself.",
    impactLevers: [],
    timeToImpact: "Not applicable. This is an output, not an input.",

    domains: ["Recovery", "Reproductive health", "Risk"],
    healthTags: ["Illness detection", "Menstrual cycle", "Circadian health", "Fever"],
    usedByScores: [
      { company: "Oura", score: "Readiness score, Cycle Insights" },
      { company: "Natural Cycles", score: "Fertility prediction" },
    ],
    whoSetsLogic: "No universal threshold for 'concerning.' Each device uses its own baseline calculation. Oura has built this into their cycle tracking and illness detection features with their own deviation thresholds.",

    emotionalValence: "Neutral for most; moderate for fertility tracking",
    userReaction: "Most people find this fascinating when it accurately predicts illness ('my ring knew I was getting sick before I did'). For people using it for fertility tracking, the temperature shift around ovulation becomes a closely watched daily ritual.",

    dataQuality: "Trustworthy for trends",
    trustDetail: "The relative change measurement is reliable. Absolute skin temperature varies a lot based on room temperature, blankets, and body position, which is why devices report deviation from baseline rather than actual degrees. Oura's approach of measuring at the finger (more stable) tends to produce cleaner data than wrist-based measurement.",
  },

  {
    id: "ecg",
    name: "ECG / electrocardiogram (single-lead)",

    whatIsMeasured: "A 30-second recording of your heart's electrical activity. It traces the electrical signal that tells your heart muscle when to contract. The resulting waveform can reveal irregular heart rhythms, most notably atrial fibrillation (AFib).",
    source: "Wearable sensor (on demand)",
    sourceDetail: "Apple Watch, Samsung Galaxy Watch, WHOOP MG, Withings ScanWatch. You place your finger on the device crown or sensor to complete the circuit. This is a single-lead ECG. A clinical ECG uses 12 leads placed across your chest and gives much more information.",

    measurementEffort: "Low effort",
    measurementEffortDetail: "Takes 30 seconds. You open the app, place your finger on the sensor, and hold still. Some devices can prompt you if they detect an irregular rhythm in the background.",
    frequencyCapability: "On demand, anytime",
    frequencyReality: "Most people take one out of curiosity when they first get the device, then rarely again unless prompted by an irregular rhythm notification.",

    cognitiveLoad: "Hard to understand",
    cognitiveLoadDetail: "The ECG waveform itself is meaningless to most people. What matters is the interpretation: 'sinus rhythm (normal)' or 'atrial fibrillation detected.' The app does the interpretation. But understanding what AFib means and what to do about it requires clinical guidance.",
    examples: [
      { value: "Sinus rhythm", meaning: "Normal. Your heart's electrical pattern looks regular and healthy. This is what you want to see." },
      { value: "Atrial fibrillation detected", meaning: "The upper chambers of your heart are beating irregularly. This is not necessarily an emergency, but it needs medical follow-up because untreated AFib increases stroke risk significantly. The device will prompt you to contact your doctor." },
    ],
    interpretation: "The device classifies the reading as sinus rhythm (normal), atrial fibrillation, or inconclusive. 'Inconclusive' usually means the recording was noisy (you moved during the test). AFib detection is the primary clinical value. The device cannot detect heart attacks, blockages, or most other heart conditions.",

    impactability: "The underlying condition may or may not be treatable",
    impactabilityDetail: "The ECG reading itself is just a snapshot. If it detects AFib, treatment options include medication (blood thinners, rate control) and procedures (ablation). The reading triggers a clinical conversation, not a self-directed action.",
    impactLevers: ["Medical treatment for detected conditions"],
    timeToImpact: "Not applicable. This is a detection tool, not something you try to improve.",

    domains: ["Heart health", "Risk"],
    healthTags: ["Atrial fibrillation detection", "Heart rhythm disorders", "Cardiovascular screening"],
    usedByScores: [
      { company: "Apple", score: "ECG app (standalone, not integrated into other scores)" },
      { company: "WHOOP", score: "Heart Screener (WHOOP MG)" },
    ],
    whoSetsLogic: "FDA-cleared algorithms. Apple's and Samsung's ECG features went through FDA De Novo classification. The AFib detection algorithm is clinically validated, though not as comprehensive as a 12-lead clinical ECG.",

    emotionalValence: "High when abnormal",
    userReaction: "Getting a 'sinus rhythm' result is reassuring and quickly forgotten. Getting an 'atrial fibrillation' result can be frightening and sends people to the ER, sometimes unnecessarily (the device may catch brief, benign episodes). There are real stories of Apple Watch ECGs catching dangerous AFib that people didn't know they had. There are also stories of false alarms causing unnecessary anxiety and medical visits.",

    dataQuality: "High for what it detects; limited in scope",
    trustDetail: "The AFib detection is clinically validated and FDA-cleared. Sensitivity and specificity are high for AFib specifically. But this is a single-lead recording that only catches rhythm problems. It cannot detect most structural heart issues, blockages, or the majority of conditions a full 12-lead ECG can identify. A normal result does not mean your heart is healthy in every way.",
  },

  // ════════════════════════════════════════
  // SLEEP
  // ════════════════════════════════════════

  {
    id: "sleep_total",
    name: "Total sleep time",

    whatIsMeasured: "How many hours and minutes you actually slept during the night. Not the same as time in bed. If you were in bed for 8 hours but lay awake for 45 minutes, your total sleep time is about 7 hours and 15 minutes.",
    source: "Wearable sensor",
    sourceDetail: "All major wearables: Apple Watch, WHOOP, Oura, Garmin, Fitbit, Samsung. All tend to slightly overcount by calling quiet wakefulness 'sleep.'",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Wear a device to bed. Total sleep time is calculated automatically.",
    frequencyCapability: "Every night",
    frequencyReality: "Reported every morning. One of the most commonly checked metrics. Most people look at this even if they ignore everything else.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Hours and minutes. Everyone understands this. More is generally better up to a point. '7 hours 20 minutes' requires no interpretation.",
    examples: [
      { value: "7 hours 45 minutes", meaning: "Solid night. Within the recommended 7-9 hour range for adults. Most people feel well-rested at this level." },
      { value: "5 hours 10 minutes", meaning: "Short night. Below the minimum recommendation. One night like this is recoverable. Several in a row will affect mood, cognition, immune function, and physical performance. Sleep debt accumulates." },
    ],
    interpretation: "The standard recommendation for adults is 7-9 hours. Consistently sleeping under 6 hours is associated with increased risk of obesity, cardiovascular disease, cognitive decline, and weakened immunity. Consistently sleeping over 9 hours can also be associated with health issues (though it's unclear if long sleep causes problems or is a symptom of them). What feels right varies by person. Some people genuinely function well on 6.5 hours; most don't.",

    impactability: "Directly changeable",
    impactabilityDetail: "Go to bed earlier. Wake up later. Reduce things that cut into sleep time (screens, late caffeine, inconsistent schedule). This is one of the most directly actionable health metrics. The barrier isn't knowledge; it's competing priorities.",
    impactLevers: ["Earlier bedtime", "Consistent sleep schedule", "Limit caffeine after noon", "Reduce screen time before bed", "Manage work/life schedule"],
    timeToImpact: "Immediate. Sleep more tonight, the number is higher tomorrow. Building a consistent habit takes 1-2 weeks.",

    domains: ["Sleep", "Recovery", "Longevity"],
    healthTags: ["Cognitive function", "Immune health", "Mood", "Weight management", "Cardiovascular health", "Athletic recovery"],
    usedByScores: [
      { company: "WHOOP", score: "Sleep Performance score, Recovery, WHOOP Age" },
      { company: "Oura", score: "Sleep score, Readiness" },
      { company: "Apple", score: "Sleep score" },
      { company: "Garmin", score: "Sleep score, Body Battery" },
      { company: "Fitbit", score: "Sleep score, Daily Readiness" },
    ],
    whoSetsLogic: "The 7-9 hour recommendation comes from the National Sleep Foundation and the American Academy of Sleep Medicine, based on extensive research. Wearable companies generally align with these guidelines but personalize by calculating your individual sleep need based on recent activity and accumulated sleep debt.",

    emotionalValence: "Moderate",
    userReaction: "People feel validated by a high number and guilty about a low one. Sleep duration is one metric where people already have a strong sense of whether they're doing well or not. The device mostly confirms what you already know. The guilt factor can be counterproductive: lying in bed anxious about not sleeping enough makes sleep worse.",

    dataQuality: "Trustworthy with a small caveat",
    trustDetail: "Total sleep time is one of the most reliable metrics from consumer wearables. The main inaccuracy: all devices tend to count periods of quiet wakefulness as light sleep, which slightly inflates the number. The overcounting is usually 10-20 minutes. Close enough for practical purposes.",
  },

  {
    id: "sleep_deep",
    name: "Deep sleep (slow-wave) time",

    whatIsMeasured: "Minutes spent in slow-wave sleep, the physically restorative stage where your body does most of its repair work. This is when growth hormone is released, muscles are repaired, immune function is strengthened, and memories are consolidated.",
    source: "Wearable sensor",
    sourceDetail: "Estimated by all major wearables from heart rate and movement patterns. Not directly measured. Clinical sleep studies use brain wave monitoring (EEG), which is the gold standard.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Measured automatically during sleep. Shows up in your morning sleep breakdown.",
    frequencyCapability: "Every night",
    frequencyReality: "Reported daily as part of sleep stage breakdown. People who track sleep tend to look at this, especially fitness-focused users.",

    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept ('deep sleep is the most restorative stage') is easy to grasp. But knowing whether 55 minutes is good or bad requires context. People tend to obsess over this number once they learn it exists.",
    examples: [
      { value: "1 hour 35 minutes", meaning: "Good amount for most adults. Suggests the body got solid physical recovery. Typically happens in the first half of the night." },
      { value: "32 minutes", meaning: "Low. Could be due to alcohol (which suppresses deep sleep), sleeping in a warm room, late exercise, aging (deep sleep naturally declines with age), or poor sleep quality. One night isn't a problem; a pattern is worth investigating." },
    ],
    interpretation: "Typical for adults: 60-120 minutes per night, or about 15-25% of total sleep. Deep sleep declines naturally with age: a 20-year-old might get 100+ minutes, a 60-year-old might get 40-60 and that's normal for them. Alcohol is the biggest controllable suppressor of deep sleep. Even 1-2 drinks can significantly reduce it.",

    impactability: "Indirectly changeable",
    impactabilityDetail: "You can't force your body into deep sleep. But you can remove things that block it: alcohol, late caffeine, warm room temperature, irregular schedule. Cool room (65-68°F), consistent bedtime, and avoiding alcohol are the most reliable levers. Exercise during the day (not right before bed) also helps.",
    impactLevers: ["Avoid alcohol", "Cool bedroom (65-68°F)", "Consistent bedtime", "Avoid caffeine after noon", "Exercise during the day (not late)"],
    timeToImpact: "Skip the drinks tonight and you may see more deep sleep tomorrow. Building a consistent pattern takes 1-2 weeks.",

    domains: ["Sleep", "Recovery"],
    healthTags: ["Physical recovery", "Immune function", "Growth hormone release", "Memory consolidation"],
    usedByScores: [
      { company: "WHOOP", score: "Sleep Performance" },
      { company: "Oura", score: "Sleep score (sleep stage component)" },
      { company: "Fitbit", score: "Sleep score" },
    ],
    whoSetsLogic: "Sleep science provides the general framework (15-25% of sleep should be deep). Consumer devices set their own expectations based on age-adjusted norms. There's no single clinical threshold for 'too little deep sleep.'",

    emotionalValence: "Moderate",
    userReaction: "Deep sleep is the number people worry about most in their sleep data. 'I only got 30 minutes of deep sleep' causes more distress than 'I slept 6 hours.' People feel they can control total sleep time but can't control deep sleep, which creates frustration. The irony: stressing about deep sleep can reduce it.",

    dataQuality: "Moderate",
    trustDetail: "This is where consumer wearables are weakest. Even the best device (Oura) correctly classifies sleep stages only 75-90% of the time compared to clinical EEG. Wearables estimate deep sleep from heart rate and movement, which are indirect proxies. The absolute number of minutes should be taken as directional, not precise. Trends over weeks are more meaningful than any single night's reading.",
  },

  {
    id: "sleep_rem",
    name: "REM sleep time",

    whatIsMeasured: "Minutes spent in REM (rapid eye movement) sleep, the stage where your brain is most active during sleep. This is when most dreaming happens. REM is critical for processing emotions, consolidating learning, and creative problem-solving.",
    source: "Wearable sensor",
    sourceDetail: "Estimated by wearables from heart rate variability patterns. Less accurately classified than deep sleep by consumer devices.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Measured automatically during sleep.",
    frequencyCapability: "Every night",
    frequencyReality: "Part of the sleep stage breakdown. Most people see it in their morning summary.",

    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "Most people have heard of REM sleep and associate it with dreaming. Understanding whether their specific number is good or bad requires context. 'Is 1 hour 20 minutes enough?' isn't intuitive.",
    examples: [
      { value: "1 hour 50 minutes", meaning: "Healthy amount. The brain got substantial time for emotional processing and memory consolidation. REM concentrates in the second half of the night, so this person likely slept a full night without cutting it short." },
      { value: "45 minutes", meaning: "Low. Most commonly caused by cutting sleep short (waking up early with an alarm during what would have been peak REM time), alcohol (which delays and suppresses REM), or cannabis use. One night isn't harmful; chronic REM deprivation affects mood and cognitive function." },
    ],
    interpretation: "Typical for adults: 90-120 minutes per night, or about 20-25% of total sleep. Unlike deep sleep, REM doesn't decline much with age. It concentrates in the later cycles of sleep (roughly 4am-7am for someone who goes to bed around 11pm). This means cutting sleep short by waking up early specifically robs you of REM. Alcohol is a major REM suppressor: it delays the first REM period and reduces total REM time.",

    impactability: "Indirectly changeable",
    impactabilityDetail: "Similar to deep sleep: you can't force REM, but you can stop blocking it. Avoid alcohol, get a full night (don't cut the morning short), and maintain a consistent schedule. Antidepressants (especially SSRIs) can suppress REM, which is a known trade-off in mental health treatment.",
    impactLevers: ["Avoid alcohol", "Sleep a full night (don't alarm too early)", "Consistent schedule", "Be aware of medication effects (SSRIs suppress REM)"],
    timeToImpact: "Skip alcohol tonight, you'll likely see more REM tomorrow. After a period of REM deprivation, your brain will 'REM rebound': extra REM the first few good nights.",

    domains: ["Sleep", "Cognitive"],
    healthTags: ["Emotional regulation", "Creativity", "Memory consolidation", "Learning", "Mental health"],
    usedByScores: [
      { company: "WHOOP", score: "Sleep Performance" },
      { company: "Oura", score: "Sleep score" },
      { company: "Fitbit", score: "Sleep score" },
    ],
    whoSetsLogic: "Sleep science. The 20-25% guideline is well established. Consumer devices generally align with this.",

    emotionalValence: "Low to moderate",
    userReaction: "Less anxiety-inducing than deep sleep for most people. People who learn that REM is connected to emotional regulation sometimes worry about low REM nights during stressful periods, but this is less common than deep sleep anxiety.",

    dataQuality: "Moderate",
    trustDetail: "REM classification by wearables is less accurate than deep sleep classification. The characteristic heart rate variability pattern of REM is detectable but can be confused with light sleep or brief awakenings. Same guidance: treat as directional, not precise. Week-over-week trends are more useful than any single night.",
  },

  {
    id: "sleep_light",
    name: "Light sleep time",

    whatIsMeasured: "Minutes spent in light sleep (stages N1 and N2 in sleep science). The transitional stages between wakefulness and deeper sleep. Despite the name, light sleep is not wasted time. It serves important functions for motor learning and memory processing.",
    source: "Wearable sensor",
    sourceDetail: "Estimated by all wearables. This is the stage devices are worst at accurately classifying.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Measured automatically during sleep.",
    frequencyCapability: "Every night",
    frequencyReality: "Part of sleep stage breakdown. Most people see it but don't know what to do with it.",

    cognitiveLoad: "Easy to understand, hard to act on",
    cognitiveLoadDetail: "The concept is clear: it's the lighter phases of sleep. But it's hard to know whether more or less light sleep is good. Most health advice focuses on deep and REM. Light sleep is the leftover.",
    examples: [
      { value: "3 hours 40 minutes", meaning: "Typical. Light sleep usually makes up about half of total sleep time. This isn't a problem. Your body moves through light sleep on the way to deep and REM stages, and some light sleep serves its own restorative purpose." },
      { value: "5 hours 30 minutes (out of 7 total)", meaning: "High proportion. Could mean the device isn't accurately distinguishing light sleep from deep/REM, or it could mean the person's sleep was genuinely shallow. Common causes: environmental disruptions (noise, light, temperature), stress, or uncomfortable sleeping conditions." },
    ],
    interpretation: "Light sleep typically accounts for 45-55% of total sleep. There's no target to hit. A very high proportion of light sleep (with low deep and REM) may indicate poor sleep quality, but the more important question is whether you feel rested, not what the percentage breakdown looks like.",

    impactability: "Not something to target",
    impactabilityDetail: "No one tries to get more or less light sleep specifically. The goal is to get enough total sleep with adequate deep and REM. Light sleep fills in the rest. Improving sleep environment (dark, cool, quiet) can shift the balance toward more deep sleep, which means proportionally less light sleep.",
    impactLevers: ["Improve sleep environment (indirect)", "Better deep/REM sleep shifts the proportion"],
    timeToImpact: "Not applicable. This is not a target metric.",

    domains: ["Sleep"],
    healthTags: ["Memory processing", "Motor learning", "Sleep architecture"],
    usedByScores: [
      { company: "All devices", score: "Included in sleep stage breakdowns but not heavily weighted in scores" },
    ],
    whoSetsLogic: "Sleep science. No clinical threshold for 'enough' or 'too much' light sleep.",

    emotionalValence: "Neutral",
    userReaction: "People generally ignore this number or feel vaguely disappointed by it ('I got mostly light sleep'). The name 'light' implies it's low-value, which isn't entirely accurate but is a hard perception to overcome.",

    dataQuality: "Low to moderate",
    trustDetail: "Light sleep is the stage wearables are worst at classifying. It's often confused with quiet wakefulness (overcounting) or with deep sleep (undercounting). The absolute number should be treated with skepticism. Think of it as 'everything that wasn't clearly deep sleep, REM, or awake.'",
  },

  {
    id: "sleep_awake",
    name: "Time awake during the night (WASO)",

    whatIsMeasured: "Total minutes you spent awake after you initially fell asleep. This counts all the times you woke up during the night, whether you noticed them or not. Brief awakenings (under a minute) are normal. Extended awakenings add up and reduce the restorative value of your sleep.",
    source: "Wearable sensor",
    sourceDetail: "All major wearables. Tends to be undercounted because devices mistake quiet wakefulness for light sleep.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Measured automatically during sleep.",
    frequencyCapability: "Every night",
    frequencyReality: "Part of sleep summary. People notice it when it's high.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Minutes awake. Less is better. Intuitive.",
    examples: [
      { value: "12 minutes total", meaning: "Normal. A few brief awakenings that you probably didn't notice. This is healthy sleep." },
      { value: "58 minutes total", meaning: "Significant disruption. Almost an hour of the night spent awake. Common causes: bathroom trips, pain, anxiety, sleep apnea, noise, partner disturbance, or hot room. If this is a regular pattern, it's worth investigating why." },
    ],
    interpretation: "Under 20 minutes is normal and healthy. 20-40 minutes is moderate disruption. Over 40 minutes regularly suggests a sleep quality issue worth addressing. In clinical sleep medicine, this metric (called WASO: wake after sleep onset) is a primary measure of insomnia severity.",

    impactability: "Depends on the cause",
    impactabilityDetail: "If you're waking because of noise, a cooler/darker room and earplugs help immediately. If it's bathroom trips, reducing fluids before bed helps. If it's anxiety, that's a deeper issue. If it's sleep apnea, a CPAP machine dramatically reduces awakenings. Identifying the cause is the first step.",
    impactLevers: ["Address the specific cause (noise, temperature, pain, anxiety, apnea)", "Reduce fluids before bed", "Dark, cool, quiet room", "CBT-I for insomnia"],
    timeToImpact: "Environmental fixes: immediate. Sleep apnea treatment (CPAP): first night. Anxiety and insomnia: weeks with proper treatment (CBT-I).",

    domains: ["Sleep"],
    healthTags: ["Sleep quality", "Insomnia", "Sleep apnea", "Anxiety", "Nocturia"],
    usedByScores: [
      { company: "WHOOP", score: "Sleep Performance (efficiency component)" },
      { company: "Oura", score: "Sleep score (efficiency component)" },
      { company: "All devices", score: "Sleep efficiency calculation" },
    ],
    whoSetsLogic: "Clinical sleep medicine has well-established criteria. Under 30 minutes WASO is considered normal. Consumer devices align with these thresholds.",

    emotionalValence: "Moderate",
    userReaction: "People who already know they wake up a lot find this validating ('I knew my sleep was bad, now I can see it'). People who didn't realize how often they wake up can be surprised. The number can motivate action (fixing the environment, seeing a doctor about apnea) or cause frustration ('I can't control this').",

    dataQuality: "Moderate",
    trustDetail: "Wearables tend to undercount wakefulness. If you lie very still while awake, the device will likely count it as light sleep. This means the actual time awake during the night is often higher than what your device reports. Clinical polysomnography (which uses brain waves) is much more accurate at detecting wakefulness.",
  },

  {
    id: "sleep_latency",
    name: "Sleep onset latency (time to fall asleep)",

    whatIsMeasured: "How many minutes it takes from when you get into bed (or when the device detects you lying down) to when you actually fall asleep.",
    source: "Wearable sensor",
    sourceDetail: "Estimated by wearables from when stillness is detected to when sleep stages begin. Less precise than clinical measurement.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic. The device detects when you lie down and when you transition to sleep.",
    frequencyCapability: "Every night",
    frequencyReality: "Part of sleep detail. Not always highlighted prominently by devices.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Minutes to fall asleep. Everyone has a sense of whether they fall asleep quickly or not. The number confirms or challenges that perception.",
    examples: [
      { value: "8 minutes", meaning: "Fast. Healthy. Suggests adequate sleep pressure (your body is ready for sleep when you get into bed). This is what most people aim for." },
      { value: "42 minutes", meaning: "Prolonged. Lying awake for 40+ minutes is frustrating and is a hallmark of sleep onset insomnia. Common causes: anxiety, too much caffeine, irregular schedule, screen time before bed, or simply going to bed before you're tired." },
    ],
    interpretation: "10-20 minutes is considered ideal. Under 5 minutes usually indicates sleep deprivation (your body is so tired it crashes immediately, which isn't healthy). Over 30 minutes on a regular basis is a clinical flag for insomnia. In CBT-I (the gold standard insomnia treatment), one technique is actually spending less time in bed to build up sleep pressure and reduce this number.",

    impactability: "Directly changeable with the right approach",
    impactabilityDetail: "This responds well to sleep hygiene changes: consistent bedtime, no screens for 30-60 minutes before bed, cool/dark room, winding down routine. If those don't work, CBT-I with a therapist is highly effective. Sleeping pills reduce latency but create dependency.",
    impactLevers: ["Consistent bedtime", "No screens before bed", "Wind-down routine", "Avoid caffeine after noon", "CBT-I for chronic issues", "Only go to bed when sleepy"],
    timeToImpact: "Behavioral changes can work within days. CBT-I typically takes 4-8 weeks. The key insight from sleep science: if you can't fall asleep within 20 minutes, get up and do something calm until you feel sleepy, then try again.",

    domains: ["Sleep"],
    healthTags: ["Insomnia screening", "Sleep hygiene", "Anxiety", "Sleep deprivation"],
    usedByScores: [
      { company: "Oura", score: "Sleep score (latency component)" },
    ],
    whoSetsLogic: "Clinical sleep medicine. The 10-20 minute ideal and 30+ minute concern thresholds are well established in sleep research.",

    emotionalValence: "Moderate",
    userReaction: "People who know they take a long time to fall asleep find this validating. People who thought they fell asleep quickly but the data says otherwise are sometimes surprised. The frustration of insomnia is well-understood, and having a number attached to it can either motivate seeking help or add to the frustration.",

    dataQuality: "Low to moderate",
    trustDetail: "This is one of the less accurate wearable measurements. Lying very still while awake looks like light sleep to the sensor. The device may say you fell asleep in 10 minutes when you actually lay awake for 25. If you want an accurate latency measure, clinical sleep studies (polysomnography) are the standard.",
  },

  {
    id: "sleep_efficiency",
    name: "Sleep efficiency (percentage)",

    whatIsMeasured: "The percentage of your time in bed that you actually spent asleep. If you were in bed for 8 hours and slept for 7, your efficiency is 87.5%. It combines sleep onset latency and nighttime awakenings into a single number.",
    source: "Wearable sensor",
    sourceDetail: "Calculated by all major wearables from sleep and wake data.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Calculated automatically from other sleep data.",
    frequencyCapability: "Every night",
    frequencyReality: "Available in sleep summaries. Not always featured prominently.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A percentage. Higher is better. 85%+ is good. Simple.",
    examples: [
      { value: "92%", meaning: "Excellent. Very little time wasted lying awake. The person falls asleep quickly and stays asleep." },
      { value: "68%", meaning: "Low. About a third of the time in bed was spent awake. This is a strong signal of a sleep quality problem, whether from insomnia, pain, apnea, or environmental disruption." },
    ],
    interpretation: "Above 85% is considered good sleep efficiency. 75-85% is moderate. Below 75% is poor and clinically significant. In CBT-I treatment for insomnia, improving sleep efficiency is the primary goal. The counterintuitive technique: spending less total time in bed (going to bed later, getting up if you can't sleep) to compress sleep into a smaller window and drive efficiency up.",

    impactability: "Directly changeable",
    impactabilityDetail: "Responds to the same changes that affect sleep onset latency and nighttime awakenings. Consistent schedule, good environment, addressing underlying causes of waking. CBT-I specifically targets sleep efficiency.",
    impactLevers: ["Address causes of waking", "Consistent schedule", "Only be in bed when sleeping", "CBT-I for insomnia"],
    timeToImpact: "Improvements can appear within days of environmental changes. CBT-I: 4-8 weeks.",

    domains: ["Sleep"],
    healthTags: ["Sleep quality", "Insomnia", "CBT-I treatment monitoring"],
    usedByScores: [
      { company: "WHOOP", score: "Sleep Performance" },
      { company: "Oura", score: "Sleep score" },
      { company: "All devices", score: "Sleep score calculations" },
    ],
    whoSetsLogic: "Clinical sleep medicine. The 85% threshold is well established and used in clinical practice.",

    emotionalValence: "Low",
    userReaction: "Most people find this number informative rather than emotional. It's clinical and clear. People with insomnia may find it discouraging ('I knew my sleep was bad') but it can also motivate treatment.",

    dataQuality: "Moderate",
    trustDetail: "Only as accurate as the inputs (time to fall asleep, time awake during the night), both of which wearables tend to underestimate. The efficiency percentage is therefore slightly inflated on most devices. But the relative trend is useful.",
  },

  {
    id: "sleep_bedtime",
    name: "Bedtime (clock time)",

    whatIsMeasured: "What time you got into bed or what time the device first detected you falling asleep. Some devices distinguish between these; others treat them as the same event.",
    source: "Wearable sensor",
    sourceDetail: "Detected automatically by wearables, or set manually via a sleep schedule.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic detection when you lie down and stop moving.",
    frequencyCapability: "Every night",
    frequencyReality: "Recorded every night. Becomes interesting when viewed as a consistency pattern over weeks.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A clock time. Everyone understands it.",
    examples: [
      { value: "10:45 PM (consistent across the week)", meaning: "Highly consistent bedtime. Research links consistent sleep timing with better cardiovascular health, independent of how many hours you sleep." },
      { value: "Ranging from 10 PM to 1:30 AM across the week", meaning: "Irregular. This kind of variability, sometimes called 'social jet lag,' disrupts your circadian rhythm similarly to crossing time zones. The body never fully adjusts." },
    ],
    interpretation: "There is no universally 'right' bedtime. What matters more is consistency. Going to bed within a 30-minute window most nights is associated with better health outcomes than hitting a specific clock time. A consistent 11:30 PM bedtime is better for your body than alternating between 10 PM and 1 AM, even if the early nights seem 'healthier.'",

    impactability: "Directly changeable",
    impactabilityDetail: "You decide when to go to bed. The challenge is that work schedules, social life, and evening habits all compete. Consistency is the goal, not an earlier time.",
    impactLevers: ["Set a consistent target bedtime", "Wind-down routine at the same time", "Reduce variable social commitments on weeknights"],
    timeToImpact: "Immediate. You can start being consistent tonight. Your circadian rhythm takes about a week to fully adjust to a new schedule.",

    domains: ["Sleep"],
    healthTags: ["Circadian health", "Sleep consistency", "Cardiovascular risk"],
    usedByScores: [
      { company: "WHOOP", score: "Sleep Performance (consistency component)" },
      { company: "Apple", score: "Sleep schedule feature" },
      { company: "Oura", score: "Sleep score (timing component)" },
    ],
    whoSetsLogic: "Sleep research emphasizes consistency rather than a specific time. Apple Watch prominently features a bedtime schedule. WHOOP scores consistency against your last 5 nights.",

    emotionalValence: "Neutral",
    userReaction: "People generally feel fine about this number. Seeing their inconsistency laid out on a chart can be a mild wake-up call ('I didn't realize how much my bedtime jumps around'), but it rarely causes distress.",

    dataQuality: "Trustworthy",
    trustDetail: "Clock time detection is straightforward and accurate. The only question is whether the device is detecting when you got into bed or when you fell asleep, and different devices handle this differently.",
  },

  {
    id: "sleep_waketime",
    name: "Wake time (clock time)",

    whatIsMeasured: "What time you woke up for the day. Not the same as when you got out of bed. Some devices detect the moment of waking; others record when you first moved significantly.",
    source: "Wearable sensor",
    sourceDetail: "Detected automatically by wearables, or recorded when an alarm goes off.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic.",
    frequencyCapability: "Every morning",
    frequencyReality: "Recorded daily. Often viewed as part of the bedtime consistency pattern.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A clock time. Completely intuitive.",
    examples: [
      { value: "6:30 AM (consistent)", meaning: "Regular wake time. This anchors the circadian rhythm. Even on weekends, staying within 30-60 minutes of this helps maintain consistent sleep quality." },
      { value: "6:15 AM weekdays, 9:45 AM weekends", meaning: "Classic social jet lag. The 3+ hour weekend shift disrupts the circadian clock. Monday mornings feel terrible because your body thinks it's still the weekend schedule." },
    ],
    interpretation: "Sleep scientists consider consistent wake time even more important than consistent bedtime for circadian rhythm stability. Morning light exposure at a consistent time is one of the strongest signals your body uses to set its internal clock. Sleeping in on weekends feels good but creates a mini jet-lag effect every Monday.",

    impactability: "Directly changeable",
    impactabilityDetail: "Set an alarm for the same time every day, including weekends. This is the single most impactful sleep hygiene change for most people, and also the one most people resist.",
    impactLevers: ["Consistent alarm time", "Limit weekend sleep-in to 30-60 minutes max", "Morning light exposure"],
    timeToImpact: "Immediate. The circadian adjustment takes about a week to stabilize.",

    domains: ["Sleep"],
    healthTags: ["Circadian health", "Cortisol rhythm", "Daytime alertness"],
    usedByScores: [
      { company: "WHOOP", score: "Sleep Performance (consistency)" },
      { company: "Apple", score: "Sleep schedule" },
    ],
    whoSetsLogic: "Sleep research. The emphasis on consistent wake time comes from circadian biology research, which is well established.",

    emotionalValence: "Neutral",
    userReaction: "People who sleep in on weekends feel slightly attacked by the recommendation to keep wake time consistent. But this is one of the areas where the evidence is strong and the user reaction is 'I know, I know, but I don't want to.'",

    dataQuality: "Trustworthy",
    trustDetail: "Accurate. Wake detection is straightforward from movement data.",
  },

  {
    id: "sleep_disturbances",
    name: "Sleep disturbances (count)",

    whatIsMeasured: "The number of times during the night that your device detected a disruption: a spike in movement, heart rate, or both. These may or may not correspond to full awakenings. You might not remember any of them in the morning.",
    source: "Wearable sensor",
    sourceDetail: "Detected by accelerometer and heart rate by Oura, WHOOP, Fitbit. Each device uses a different threshold for what counts as a disturbance.",

    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic during sleep.",
    frequencyCapability: "Every night",
    frequencyReality: "Available in sleep details. Most people only notice when the count is unusually high.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A count. Fewer is better. Simple.",
    examples: [
      { value: "4 disturbances", meaning: "Normal night. A few brief disruptions that probably didn't fully wake you. Most healthy adults have 3-8 per night." },
      { value: "22 disturbances", meaning: "Very disrupted night. Could indicate sleep apnea (repeated micro-awakenings from airway obstruction), restless legs, pain, environmental noise, or a sick child. If consistently high, worth investigating the cause." },
    ],
    interpretation: "There's no clinical standard for 'normal' disturbance count from consumer devices because each device defines the threshold differently. The useful signal is your personal pattern. A sudden jump in disturbances compared to your usual count is more informative than the absolute number.",

    impactability: "Depends on the cause",
    impactabilityDetail: "Environmental disturbances (noise, light, temperature): fix the environment. Sleep apnea: CPAP treatment. Pain: pain management. Restless legs: medical treatment. Identifying the cause is the key step.",
    impactLevers: ["Fix sleep environment", "Treat sleep apnea", "Manage pain", "Treat restless legs"],
    timeToImpact: "Environmental fixes: immediate. Medical treatment: varies.",

    domains: ["Sleep"],
    healthTags: ["Sleep quality", "Sleep apnea screening", "Restless legs", "Environmental factors"],
    usedByScores: [
      { company: "Oura", score: "Sleep score" },
      { company: "Fitbit", score: "Sleep score" },
    ],
    whoSetsLogic: "Each device company sets its own threshold. No clinical standard for consumer disturbance counts.",

    emotionalValence: "Neutral to moderate",
    userReaction: "A high count can be alarming, especially if the person wasn't aware they were waking up that often. Can prompt a useful doctor visit (especially for undiagnosed sleep apnea). A normal count doesn't generate any reaction.",

    dataQuality: "Low to moderate",
    trustDetail: "Highly variable across devices. The same night could register 5 disturbances on Oura and 15 on Fitbit because they use different thresholds. Useful for tracking your own trends on one device, but don't compare across devices or against anyone else's numbers.",
  },

  {
    id: "snoring",
    name: "Snoring duration and intensity",

    whatIsMeasured: "How many minutes you snored during the night, and how loud the snoring was. Detected through the microphone on a nearby phone or device.",
    source: "Phone microphone or smart device",
    sourceDetail: "iPhone (Apple Health), Samsung phones, or dedicated apps (SnoreLab). Requires the phone to be on the nightstand with the microphone active. Not measured by wrist devices.",

    measurementEffort: "Low effort",
    measurementEffortDetail: "Leave your phone on the nightstand with the app open. But some people find it uncomfortable to have their phone recording audio all night.",
    frequencyCapability: "Every night if enabled",
    frequencyReality: "Most people try it for a few nights out of curiosity. Few track continuously. Partners are often the ones who suggest tracking.",

    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Minutes of snoring. Louder is worse. Simple.",
    examples: [
      { value: "12 minutes, light intensity", meaning: "Minor. Most adults snore occasionally. This level is unlikely to indicate any health concern and probably doesn't disturb a partner." },
      { value: "3 hours 20 minutes, heavy intensity with pauses", meaning: "Significant. The long duration and heavy intensity suggest possible obstructive sleep apnea, especially if there are pauses (moments where breathing stops). This should prompt a conversation with a doctor and possibly a sleep study." },
    ],
    interpretation: "Occasional light snoring is normal and harmless. Heavy, persistent snoring, especially with breathing pauses or gasping, is the primary symptom of obstructive sleep apnea. Sleep apnea affects an estimated 30 million Americans, and most are undiagnosed. If snoring data shows a pattern of heavy snoring with pauses, it's one of the more actionable findings in consumer health tracking.",

    impactability: "Depends on the cause",
    impactabilityDetail: "Positional snoring (worse on your back): sleeping on your side helps immediately. Weight-related snoring: weight loss helps over weeks to months. Sleep apnea: CPAP or oral appliance. Alcohol and sedatives worsen snoring.",
    impactLevers: ["Sleep on your side", "Lose weight", "Reduce alcohol", "Treat sleep apnea (CPAP)", "Nasal strips or oral appliances"],
    timeToImpact: "Positional changes: same night. CPAP: first night. Weight loss: weeks to months.",

    domains: ["Sleep", "Risk"],
    healthTags: ["Sleep apnea screening", "Partner sleep disruption", "Airway health"],
    usedByScores: [
      { company: "Apple", score: "Highlighted in Health app respiratory section" },
    ],
    whoSetsLogic: "Clinical sleep medicine defines the thresholds for concerning snoring. Consumer apps vary in how they classify intensity levels.",

    emotionalValence: "Moderate",
    userReaction: "Snoring carries some social stigma. People can feel embarrassed seeing the data, especially if a partner is the one who suggested tracking. But the data can also be genuinely motivating: 'I had no idea I snored for 3 hours' often leads to a doctor visit that catches sleep apnea. This is one of the cases where slightly uncomfortable data can lead to a life-improving diagnosis.",

    dataQuality: "Moderate",
    trustDetail: "Microphone-based detection can pick up partner snoring, pet noise, or ambient sound and misattribute it. Best results when the person sleeps alone or the app has calibration for the specific user. Duration is more reliable than intensity classification. Apps like SnoreLab let you listen to recordings to verify.",
  },

  // ════════════════════════════════════════
  // ACTIVITY & MOVEMENT
  // ════════════════════════════════════════

  {
    id: "steps", name: "Steps",
    whatIsMeasured: "How many steps you take in a day. Counted by an accelerometer in your phone or watch that detects the repeating motion pattern of walking.",
    source: "Wearable sensor or phone",
    sourceDetail: "Accelerometer in any phone, watch, or fitness tracker. Nearly universal. Accuracy varies by device placement (wrist vs. pocket).",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Completely automatic if you carry a phone or wear a device.",
    frequencyCapability: "Counted continuously throughout the day",
    frequencyReality: "Daily total is the standard view. Most people check once or twice a day.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Everyone understands steps. More is better. No interpretation needed.",
    examples: [
      { value: "8,200 steps", meaning: "Good daily count for most adults. Research shows mortality benefits plateau around 7,000-8,000 for older adults, so this person is in a solid range." },
      { value: "2,400 steps", meaning: "Sedentary day. Typical of someone who works from home and doesn't make a point of walking. Consistently low step counts are associated with higher health risks." },
    ],
    interpretation: "10,000 steps/day became the default target from a 1960s Japanese marketing campaign, not from science. Research shows meaningful health benefits start around 4,000 steps and increase up to about 7,000-8,000, with diminishing returns after that. Any increase from your current baseline is beneficial.",
    impactability: "Directly changeable",
    impactabilityDetail: "Walk more. Take the stairs. Park farther away. This is one of the most directly actionable health metrics. The barrier is habit, not knowledge.",
    impactLevers: ["Walk more", "Take stairs", "Walking meetings", "Dog walking", "Park farther away", "Post-meal walks"],
    timeToImpact: "Immediate. Walk more today, the number is higher today.",
    domains: ["Activity", "Heart health", "Longevity"],
    healthTags: ["Cardiovascular health", "Weight management", "Mortality risk", "Sedentary behavior"],
    usedByScores: [
      { company: "Apple", score: "Move Ring (calories, not steps directly)" },
      { company: "WHOOP", score: "WHOOP Age (Healthspan)" },
      { company: "Fitbit", score: "Daily step goal" },
      { company: "Garmin", score: "Daily step goal, Intensity Minutes" },
    ],
    whoSetsLogic: "The 10,000 target is cultural, not clinical. WHO recommends 150 minutes of moderate activity per week, which roughly translates to 7,000-8,000 steps/day. Most devices let you set your own goal.",
    emotionalValence: "Neutral",
    userReaction: "One of the most motivating health metrics. People like watching the number go up. The gamification works. Closing step goals creates a small daily sense of accomplishment. Very rarely causes anxiety.",
    dataQuality: "Trustworthy",
    trustDetail: "Step counting is mature technology and quite accurate for walking and running. It undercounts cycling and swimming (no step motion). It can overcount during activities with repetitive arm movements (pushing a stroller, gesturing while talking). Close enough for practical purposes.",
  },

  {
    id: "distance", name: "Distance traveled (walking/running)",
    whatIsMeasured: "How far you walked, ran, or hiked, in miles or kilometers. Calculated from your step count and estimated stride length, or from GPS when you're outdoors.",
    source: "Wearable sensor",
    sourceDetail: "GPS (outdoors, accurate to 1-3%) or accelerometer-estimated (indoors, less accurate). Most watches have GPS built in.",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic during tracked outdoor activities. Indoor distance is estimated and less reliable.",
    frequencyCapability: "Per activity session or daily total",
    frequencyReality: "Runners and walkers check this per session. Most people see a daily total passively.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Miles or kilometers. Intuitive.",
    examples: [
      { value: "3.2 miles (run)", meaning: "A solid recreational run. About 30-35 minutes for most joggers." },
      { value: "0.4 miles (daily total)", meaning: "Very low. This person barely left their desk. A mile is about 2,000 steps, so 0.4 miles is roughly 800 steps." },
    ],
    interpretation: "There's no universal distance target. For runners, weekly mileage and the 10% rule (don't increase more than 10% per week) matter more than daily distance. For general health, distance is less useful than steps or active minutes because it doesn't account for intensity.",
    impactability: "Directly changeable",
    impactabilityDetail: "Go farther. Same levers as steps.",
    impactLevers: ["Walk or run more", "Longer routes", "Explore new areas"],
    timeToImpact: "Immediate.",
    domains: ["Activity"],
    healthTags: ["Cardiovascular fitness", "Training volume"],
    usedByScores: [
      { company: "Garmin", score: "Training Load, Weekly Mileage" },
      { company: "Apple", score: "Workout summaries" },
    ],
    whoSetsLogic: "Running communities and training plans set mileage targets. No clinical body prescribes a daily distance.",
    emotionalValence: "Neutral",
    userReaction: "Runners care about this deeply. Non-runners barely look at it.",
    dataQuality: "Trustworthy outdoors",
    trustDetail: "GPS distance is accurate to 1-3%. Indoor/treadmill distance estimated from stride length is less reliable, often undercounting by 5-15%.",
  },

  {
    id: "floors_climbed", name: "Floors climbed",
    whatIsMeasured: "How many floors (about 10 feet of elevation gain each) you climbed during the day. Captures stair-climbing and hill-walking, which are more physically demanding than walking on flat ground.",
    source: "Wearable sensor",
    sourceDetail: "Barometric altimeter in Apple Watch, Fitbit, Garmin. Not available on all devices. Measures air pressure changes to detect elevation gain.",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic if your device has an altimeter.",
    frequencyCapability: "Counted throughout the day",
    frequencyReality: "Daily total. Most people notice when it's unusually high or low.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Floors. Intuitive. More is better.",
    examples: [
      { value: "12 floors", meaning: "Active day with some stairs or hills. Equivalent to climbing about 120 feet of elevation." },
      { value: "1 floor", meaning: "Flat day. Common for people who work on one level and don't seek out stairs." },
    ],
    interpretation: "No clinical target. Stair climbing is associated with cardiovascular fitness and leg strength. Even a few flights a day adds meaningful intensity that flat walking doesn't provide.",
    impactability: "Directly changeable",
    impactabilityDetail: "Take the stairs instead of the elevator. Walk hilly routes.",
    impactLevers: ["Take stairs", "Walk hilly routes"],
    timeToImpact: "Immediate.",
    domains: ["Activity"],
    healthTags: ["Cardiovascular fitness", "Leg strength", "Functional fitness"],
    usedByScores: [
      { company: "Fitbit", score: "Floors goal" },
      { company: "Apple", score: "Flights climbed in Activity" },
    ],
    whoSetsLogic: "Device companies set default goals (Fitbit defaults to 10 floors/day). No clinical standard.",
    emotionalValence: "Neutral",
    userReaction: "A fun secondary metric. People enjoy seeing a high count on hilly hike days. Rarely causes any negative reaction.",
    dataQuality: "Moderate",
    trustDetail: "Barometric altimeters can be triggered by weather changes (rapid pressure drops) or elevators. Generally reliable for actual stair climbing but can occasionally show phantom floors.",
  },

  {
    id: "exercise_duration", name: "Exercise session duration",
    whatIsMeasured: "How long a specific workout lasted, in minutes. The basic building block for tracking whether you're meeting exercise guidelines.",
    source: "Wearable sensor or self-reported",
    sourceDetail: "Auto-detected or manually started on wearables. Some devices auto-detect walks and runs but miss strength training and yoga.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "If you start a workout on your device, it captures duration automatically. Some devices auto-detect. Otherwise you log it yourself.",
    frequencyCapability: "Per workout session",
    frequencyReality: "Tracked per session and aggregated weekly. The weekly total is what guidelines care about.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Minutes. Everyone understands this.",
    examples: [
      { value: "45 minutes", meaning: "A solid workout. Three of these per week would meet the 150-minute moderate activity guideline." },
      { value: "12 minutes", meaning: "Short. Better than nothing, and short intense sessions (like HIIT) can be highly effective. But if this is the only exercise of the week, it falls short of guidelines." },
    ],
    interpretation: "WHO and most health organizations recommend at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity exercise per week. Duration alone doesn't tell the full story; intensity and type matter too. A 45-minute walk and a 45-minute HIIT session are very different physiologically.",
    impactability: "Directly changeable",
    impactabilityDetail: "Exercise longer or more frequently. The hardest part is building the habit, not understanding the goal.",
    impactLevers: ["Schedule workouts", "Start with shorter sessions and build up", "Find activities you enjoy", "Workout with others for accountability"],
    timeToImpact: "Immediate. Exercise more today, the number is higher today.",
    domains: ["Activity", "Heart health", "Longevity"],
    healthTags: ["Cardiovascular fitness", "Weight management", "Mental health", "Longevity"],
    usedByScores: [
      { company: "Apple", score: "Exercise Ring (minutes of brisk activity)" },
      { company: "WHOOP", score: "Strain score" },
      { company: "Garmin", score: "Intensity Minutes" },
      { company: "Fitbit", score: "Active Zone Minutes" },
    ],
    whoSetsLogic: "WHO, American Heart Association, and CDC all converge on the 150-minute recommendation. This is one of the most well-established health guidelines.",
    emotionalValence: "Low to moderate",
    userReaction: "People feel good when they see a long session logged. Missing workouts can trigger guilt, especially if there's a streak or goal system. The Apple Exercise Ring closing is surprisingly motivating for many people.",
    dataQuality: "Trustworthy",
    trustDetail: "Duration tracking is straightforward and accurate. The main question is whether auto-detection correctly identifies the start and end of exercise, which varies by activity type.",
  },

  {
    id: "active_calories", name: "Active calories burned",
    whatIsMeasured: "An estimate of how many calories you burned through physical activity above your resting metabolism. This is the 'extra' energy your body used because you moved, not the calories you'd burn lying in bed all day.",
    source: "Wearable sensor",
    sourceDetail: "Estimated by wearable from heart rate, movement data, and your body stats (age, weight, sex). Always an estimate.",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic throughout the day.",
    frequencyCapability: "Accumulated continuously",
    frequencyReality: "Daily total. The Apple Move Ring is the most prominent display of this metric.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "Calories make intuitive sense, but the accuracy of the estimate is poorly understood. Most people treat the number as more precise than it actually is.",
    examples: [
      { value: "520 active calories", meaning: "Active day. Roughly equivalent to a 45-minute run plus normal daily movement for an average adult." },
      { value: "85 active calories", meaning: "Very sedentary day. Barely moved beyond getting up to eat and use the bathroom." },
    ],
    interpretation: "There's no universal calorie target because it depends on your size, fitness level, and goals. The Apple Move Ring lets you set a personal goal. The number is useful for relative comparison (today vs. yesterday) but should not be treated as precise enough to calculate exact food intake.",
    impactability: "Directly changeable",
    impactabilityDetail: "Move more, burn more. Higher intensity burns more per minute.",
    impactLevers: ["Any physical activity"],
    timeToImpact: "Immediate.",
    domains: ["Activity", "Nutrition"],
    healthTags: ["Weight management", "Energy balance", "Training load"],
    usedByScores: [
      { company: "Apple", score: "Move Ring" },
      { company: "Fitbit", score: "Calorie burn goal" },
      { company: "Garmin", score: "Calorie tracking" },
    ],
    whoSetsLogic: "You set your own calorie goal (Apple lets you adjust the Move Ring target). No clinical body prescribes a daily active calorie target.",
    emotionalValence: "Low",
    userReaction: "The Move Ring gamification makes this motivating for Apple Watch users. The number itself is less emotionally loaded than weight or body fat. People generally feel positive about burning calories.",
    dataQuality: "Moderate",
    trustDetail: "Calorie burn estimates from wearables vary by 15-30% from actual expenditure depending on activity type. Overestimates for activities with lots of arm movement, underestimates for cycling. Useful for relative trends, not precise energy accounting.",
  },

  {
    id: "active_zone_min", name: "Active zone minutes / intensity minutes",
    whatIsMeasured: "Time spent with your heart rate elevated above a moderate threshold. A more nuanced measure than steps because it accounts for how hard you're working, not just whether you're moving. Vigorous activity often counts double.",
    source: "Wearable sensor",
    sourceDetail: "Fitbit (Active Zone Minutes), Garmin (Intensity Minutes), Apple (Exercise Ring minutes). Each uses slightly different heart rate zone definitions.",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic from heart rate monitoring during any activity.",
    frequencyCapability: "Accumulated throughout the day",
    frequencyReality: "Daily total, with a weekly aggregate view. Weekly total is what maps to health guidelines.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept (harder effort counts more) makes sense. But the multiplier system (vigorous = 2x) and the fact that different devices define zones differently can be confusing.",
    examples: [
      { value: "96 active zone minutes (from a 40-minute hard workout)", meaning: "The multiplier effect: 40 minutes of vigorous exercise earned 2x credit. This person is nearly two-thirds of the way to the weekly 150-minute goal in a single session." },
      { value: "22 active zone minutes (from a 30-minute walk)", meaning: "A brisk walk that got the heart rate into the moderate zone for about 22 of the 30 minutes. Moderate effort, 1x credit." },
    ],
    interpretation: "WHO recommends 150 moderate-intensity or 75 vigorous-intensity minutes per week. The double-counting for vigorous activity reflects the greater physiological benefit. This metric is a better proxy for 'did you get enough exercise' than steps alone.",
    impactability: "Directly changeable",
    impactabilityDetail: "Exercise at higher intensity to earn more minutes. A brisk walk earns 1x. A run earns 2x. The same 30 minutes at different intensities produces different results.",
    impactLevers: ["Increase exercise intensity", "Add intervals to walks", "Any heart-rate-elevating activity"],
    timeToImpact: "Immediate.",
    domains: ["Activity", "Heart health"],
    healthTags: ["Cardiovascular fitness", "Exercise guidelines compliance", "Training intensity"],
    usedByScores: [
      { company: "Fitbit", score: "Active Zone Minutes weekly goal" },
      { company: "Garmin", score: "Intensity Minutes weekly goal" },
      { company: "Apple", score: "Exercise Ring (30 min/day of brisk activity)" },
    ],
    whoSetsLogic: "Based on WHO physical activity guidelines. Device companies translate the guidelines into their own zone systems and multipliers.",
    emotionalValence: "Neutral",
    userReaction: "People who understand the system find it more motivating than steps because effort is rewarded. The weekly goal creates a useful cadence. Less intuitive than steps for new users.",
    dataQuality: "Trustworthy",
    trustDetail: "As reliable as the underlying heart rate measurement. If heart rate zones are calibrated correctly, the time-in-zone calculation is straightforward. The main variable is whether your zones are set accurately for your fitness level.",
  },

  {
    id: "hr_zones", name: "Time in heart rate zones (per workout)",
    whatIsMeasured: "A breakdown of how many minutes you spent in each heart rate zone during a single workout. Zones typically range from Zone 1 (easy recovery) to Zone 5 (all-out effort). Shows whether you trained at the right intensity for your goal.",
    source: "Wearable sensor",
    sourceDetail: "Any device that tracks heart rate during exercise. Chest straps are more accurate for interval training with rapid HR changes.",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic during any tracked workout with heart rate monitoring.",
    frequencyCapability: "Per workout session",
    frequencyReality: "Available in workout summaries. Endurance athletes check this regularly. Casual exercisers rarely look at it.",
    cognitiveLoad: "Moderate to hard",
    cognitiveLoadDetail: "Understanding what the zones mean and which zone you should target for different goals (fat burning vs. endurance vs. speed) requires some knowledge. The colored bar charts help, but the underlying concepts aren't intuitive.",
    examples: [
      { value: "Zone 2: 42 min, Zone 3: 8 min (50-min easy run)", meaning: "This runner spent most of the time in the aerobic base zone, which is ideal for building endurance. A well-paced easy run." },
      { value: "Zone 4: 18 min, Zone 5: 6 min (HIIT session)", meaning: "Significant time at high intensity. This is a demanding session that requires recovery afterward. The body adapts to this stress, but too much time in Zone 4-5 without recovery leads to overtraining." },
    ],
    interpretation: "Most endurance coaches recommend spending 80% of training time in Zone 2 (conversational pace) and only 20% in Zone 4-5 (hard effort). This 80/20 rule is well-supported by research. Many recreational athletes make the mistake of going too hard on easy days and not hard enough on hard days.",
    impactability: "Directly changeable",
    impactabilityDetail: "Control your pace. Slow down for more Zone 2 time. Speed up or add intervals for Zone 4-5 time. A heart rate display during exercise gives real-time feedback.",
    impactLevers: ["Adjust pace during exercise", "Use heart rate alerts", "Follow structured training plans"],
    timeToImpact: "Immediate within the session. Fitness adaptations from consistent zone training take weeks to months.",
    domains: ["Activity"],
    healthTags: ["Training optimization", "Endurance building", "Cardiovascular adaptation"],
    usedByScores: [
      { company: "WHOOP", score: "Strain score" },
      { company: "Garmin", score: "Training Effect, Training Load" },
      { company: "Polar", score: "Training Load Pro" },
    ],
    whoSetsLogic: "Exercise science sets the framework. Zone boundaries are percentages of max HR or lactate threshold. Each device company uses slightly different calculations. You can usually customize them.",
    emotionalValence: "Neutral",
    userReaction: "Serious athletes love this data. Casual exercisers find it overwhelming. Some people get anxious about being 'in the wrong zone,' which can take the fun out of exercise.",
    dataQuality: "Trustworthy",
    trustDetail: "Accurate if heart rate measurement is reliable (chest straps are best for intervals). The zones themselves are only as good as your max HR setting. If your max HR is wrong, all zones are shifted.",
  },

  {
    id: "strength_sets_reps", name: "Strength training: sets, reps, weight",
    whatIsMeasured: "How many sets and repetitions you performed for each exercise, and how much weight you used. The fundamental data of resistance training. Tracking this over time shows whether you're progressively increasing the challenge (progressive overload), which is what drives muscle growth.",
    source: "Self-reported (mostly)",
    sourceDetail: "Manually logged via apps (Strong, Hevy, Apple Fitness). Apple Watch and WHOOP can auto-detect some lifts but cannot determine the weight. Logging weight requires manual input.",
    measurementEffort: "Moderate effort",
    measurementEffortDetail: "You have to log each exercise, each set, the number of reps, and the weight. Between sets at the gym, this takes 15-20 seconds per set. Some people find it disruptive to their workout flow.",
    frequencyCapability: "Per set within a session",
    frequencyReality: "Per workout, 2-5 times per week for regular lifters. Logging consistency drops off over time for many people.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "3 sets of 10 reps at 135 lbs. Completely intuitive. The concept of progressive overload (gradually increasing weight or reps) is easy to grasp.",
    examples: [
      { value: "Squat: 3x8 at 185 lbs", meaning: "Three sets of eight repetitions at 185 pounds. This is a moderate working weight for an intermediate lifter. If last month they were doing 3x8 at 175, they're progressing." },
      { value: "Squat: 3x8 at 185 lbs (same as 3 months ago)", meaning: "No progression. The person is maintaining but not building. Could be intentional (maintenance phase) or a sign they're stuck and need to adjust their program." },
    ],
    interpretation: "The goal for most people is progressive overload: gradually increasing weight, reps, or sets over weeks and months. The numbers tell you whether your program is working. Stalling for more than 2-3 weeks usually means something needs to change (more food, more sleep, different programming).",
    impactability: "Directly changeable",
    impactabilityDetail: "Add weight to the bar. Do one more rep. Add a set. The levers are obvious. The challenge is consistency and recovery.",
    impactLevers: ["Progressive overload", "Consistent training schedule", "Adequate protein intake", "Sufficient sleep for recovery"],
    timeToImpact: "Session-to-session improvements for beginners (weeks). Intermediate and advanced lifters may take months to add meaningful weight.",
    domains: ["Activity", "Body composition", "Longevity"],
    healthTags: ["Muscle mass", "Bone density", "Metabolic health", "Functional strength", "Sarcopenia prevention"],
    usedByScores: [
      { company: "WHOOP", score: "WHOOP Age (strength activity input)" },
      { company: "Apple", score: "Workout summaries (duration and calories only)" },
    ],
    whoSetsLogic: "Exercise science and strength coaching set the frameworks (rep ranges for strength vs. hypertrophy vs. endurance). No clinical body prescribes specific weight targets. ACSM recommends resistance training 2-3 days per week for all adults.",
    emotionalValence: "Low to moderate",
    userReaction: "People who track strength training tend to find it motivating. Seeing progress in the numbers is satisfying. Stalling can be frustrating. For beginners, the logging itself can feel intimidating (not knowing proper form, feeling self-conscious about low weights).",
    dataQuality: "High (if logged accurately)",
    trustDetail: "This is one of the few metrics where the person controls the accuracy completely. If you log what you actually did, the data is perfect. The challenge is consistency of logging, not accuracy of measurement.",
  },

  {
    id: "standing_hours", name: "Standing hours",
    whatIsMeasured: "How many hours of the day included at least one minute of standing or movement. Designed to combat prolonged unbroken sitting, which carries health risks independent of how much you exercise.",
    source: "Wearable sensor",
    sourceDetail: "Apple Watch (Stand Ring, goal of 12 hours), Fitbit (hourly reminders). Detected via accelerometer.",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Automatic. The watch nudges you ('time to stand') if you've been sitting for most of an hour.",
    frequencyCapability: "Tracked hourly throughout the day",
    frequencyReality: "Hourly reminders. Daily total. Most Apple Watch users are familiar with the Stand Ring.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Hours where you stood up. Completely intuitive.",
    examples: [
      { value: "12 of 12 hours", meaning: "Stand Ring closed. You moved at least once per hour for 12 waking hours. Good distribution of movement throughout the day." },
      { value: "5 of 12 hours", meaning: "Long stretches of unbroken sitting. Common on days with back-to-back meetings or long travel. The health concern isn't total sitting time but unbroken sitting time." },
    ],
    interpretation: "Research links prolonged unbroken sitting with cardiovascular and metabolic risks, even in people who exercise regularly. Breaking up sitting with brief movement every hour reduces these risks. The Stand Ring isn't about exercise; it's about not being motionless for hours at a stretch.",
    impactability: "Directly changeable",
    impactabilityDetail: "Stand up and move for a minute each hour. That's it. The nudge from the watch is one of the most effective micro-interventions in wearable design.",
    impactLevers: ["Respond to hourly stand reminders", "Walking meetings", "Standing desk", "Set personal timer"],
    timeToImpact: "Immediate. Stand up now, the hour counts.",
    domains: ["Activity"],
    healthTags: ["Sedentary behavior reduction", "Metabolic health", "Circulation"],
    usedByScores: [
      { company: "Apple", score: "Stand Ring" },
    ],
    whoSetsLogic: "Apple set the 12-hour default. Research supports breaking up sitting but hasn't established a specific number of standing hours as a target.",
    emotionalValence: "Neutral",
    userReaction: "The hourly nudge is one of Apple Watch's most liked features. People find it helpful without being annoying (most of the time). Missing it doesn't cause guilt the way missing exercise does.",
    dataQuality: "Trustworthy",
    trustDetail: "Simple and accurate. The device detects whether you stood and moved during the hour. Occasionally miscounts if you stand very briefly.",
  },

  // ════════════════════════════════════════
  // GLUCOSE & METABOLIC
  // ════════════════════════════════════════

  {
    id: "glucose_cgm", name: "Continuous glucose level (CGM)",
    whatIsMeasured: "Your glucose level in milligrams per deciliter, measured every 1-5 minutes by a small sensor under your skin. It shows how your blood sugar responds to food, exercise, stress, and sleep in near-real-time.",
    source: "Wearable sensor (under-skin patch)",
    sourceDetail: "Dexcom G7, FreeStyle Libre 3 (prescription for insulin users). Dexcom Stelo (over-the-counter for non-insulin users). A tiny sensor filament sits just under the skin, usually on the upper arm, and lasts 10-15 days.",
    measurementEffort: "Low effort after setup",
    measurementEffortDetail: "Applying the sensor takes a few seconds (a spring-loaded applicator pushes it in). After that, readings are automatic for 10-15 days. No fingersticks needed. You just glance at your phone.",
    frequencyCapability: "Every 1-5 minutes, 24 hours a day",
    frequencyReality: "Continuous, but most people check a few times a day and after meals. The app sends alerts if glucose goes too high or too low.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The number itself (110 mg/dL) is easy to read. Understanding what causes spikes, what a 'good' post-meal response looks like, and how to interpret the trend arrows takes some learning. The real-time feedback makes it easier to learn by doing.",
    examples: [
      { value: "95 mg/dL (fasting)", meaning: "Normal fasting glucose. The body is regulating well overnight." },
      { value: "185 mg/dL (1 hour after pasta)", meaning: "A significant post-meal spike. This person's body struggled to process the carbohydrate load. With a CGM, they can see this happen in real time and experiment: adding protein, walking after the meal, or choosing a different food might blunt the spike next time." },
    ],
    interpretation: "For non-diabetics, fasting glucose under 100 is normal. Post-meal spikes ideally stay under 140 and return to baseline within 2 hours. For people with diabetes, target ranges are individualized with their doctor. The power of CGM is seeing the cause-and-effect: you eat something, you see what happens, you learn what works for your body.",
    impactability: "Directly changeable in the moment",
    impactabilityDetail: "A post-meal walk can reduce a glucose spike within 15-20 minutes. Food choices have immediate visible effects. This tight feedback loop is why CGMs drive behavior change more effectively than quarterly A1C tests.",
    impactLevers: ["Food choices", "Post-meal walking", "Meal timing", "Meal composition (adding protein/fat to carbs)", "Exercise", "Sleep quality", "Stress management"],
    timeToImpact: "Minutes. Walk after a meal and watch the spike flatten in real time. Long-term glucose management improves over weeks to months.",
    domains: ["Metabolic", "Nutrition", "Chronic condition management"],
    healthTags: ["Diabetes management", "Pre-diabetes", "Metabolic health", "Diet optimization", "Weight management"],
    usedByScores: [
      { company: "Dexcom", score: "Time in Range, Clarity reports" },
      { company: "Abbott", score: "LibreView reports, Glucose Pattern Insights" },
    ],
    whoSetsLogic: "Clinical guidelines (ADA, International Consensus) set target ranges. For non-insulin users, Dexcom Stelo provides general wellness guidance rather than clinical thresholds.",
    emotionalValence: "Moderate to high",
    userReaction: "CGM is transformative for many people. Seeing the direct connection between food and glucose is an 'aha' moment. But it can also become obsessive: some people develop anxiety about every spike, even normal ones. For people with diabetes, a reading of 250+ can cause panic. The real-time nature is both the strength and the risk.",
    dataQuality: "High",
    trustDetail: "Modern CGMs (Dexcom G7, Libre 3) are highly accurate, approved for making insulin dosing decisions without fingerstick confirmation. There is a 5-20 minute lag behind actual blood glucose because the sensor measures interstitial fluid, not blood directly. During rapid changes (immediately after eating or intense exercise), the lag is most noticeable.",
  },

  {
    id: "glucose_fasting", name: "Fasting glucose (fingerstick or lab)",
    whatIsMeasured: "Your blood sugar level after not eating for at least 8 hours. One of the most basic screening tests for diabetes and metabolic health.",
    source: "Home fingerstick meter or lab blood draw",
    sourceDetail: "Fingerstick glucometer at home (less accurate, immediate results) or venous blood draw at a lab (more accurate, results in 1-3 days).",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Fingerstick: prick your finger, apply blood to a test strip, read the result. Takes about 30 seconds but involves pain. Lab: requires a doctor's order, a visit, and fasting.",
    frequencyCapability: "As often as you want (fingerstick) or at each lab visit",
    frequencyReality: "People with diabetes: 1-8 times per day via fingerstick. Everyone else: once a year as part of routine bloodwork.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A number in mg/dL with clear cutoffs. Under 100 is normal. Over 126 is diabetes. Most adults have heard these thresholds.",
    examples: [
      { value: "92 mg/dL", meaning: "Normal. The body regulated glucose well overnight. No concern." },
      { value: "118 mg/dL", meaning: "Pre-diabetes range (100-125). This person's fasting glucose is higher than it should be. It doesn't mean they have diabetes yet, but without changes, they're on a trajectory toward it." },
    ],
    interpretation: "Under 100: normal. 100-125: pre-diabetes (impaired fasting glucose). 126 or higher on two separate occasions: diabetes diagnosis. A single high reading can be caused by stress, illness, or poor sleep. The trend over multiple tests matters more.",
    impactability: "Takes months to change",
    impactabilityDetail: "Fasting glucose responds to sustained dietary changes, exercise, weight loss, and medication. You can't lower it overnight. But moving from pre-diabetes back to normal is achievable with lifestyle changes.",
    impactLevers: ["Dietary changes (reducing refined carbs and sugar)", "Regular exercise", "Weight loss", "Better sleep", "Stress management", "Metformin (if prescribed)"],
    timeToImpact: "Weeks to months for lifestyle changes. Medication (metformin) can start working within 1-2 weeks.",
    domains: ["Metabolic", "Labs", "Risk"],
    healthTags: ["Diabetes screening", "Metabolic health", "Insulin resistance"],
    usedByScores: [
      { company: "Health plans", score: "CMS Star Ratings (blood glucose control)" },
      { company: "InsideTracker", score: "InnerAge" },
    ],
    whoSetsLogic: "American Diabetes Association sets the diagnostic thresholds (100/126). These are well-established and universally used in clinical practice.",
    emotionalValence: "Moderate to high",
    userReaction: "A pre-diabetes result is often a wake-up call. Many people respond with productive lifestyle changes. Some respond with denial ('it's just borderline'). A diabetes diagnosis carries significant emotional weight: fear, grief, frustration, and sometimes shame. How the number is delivered matters enormously.",
    dataQuality: "High (lab) / Moderate (fingerstick)",
    trustDetail: "Lab fasting glucose is very accurate. Home fingerstick meters are accurate to within 15-20% of lab values, which is good enough for daily management but means a home reading of 105 could really be anywhere from 85 to 125.",
  },

  {
    id: "insulin_dose", name: "Insulin dose administered",
    whatIsMeasured: "How many units of insulin were injected or delivered by pump for each dose. Tracking insulin alongside glucose data helps optimize dosing and prevent both high glucose (too little insulin) and low glucose (too much).",
    source: "Self-reported, smart pen, or insulin pump",
    sourceDetail: "Manually logged, recorded by smart insulin pens (InPen, NovoPen Echo Plus), or automated by insulin pump (Omnipod 5, Tandem t:slim). Closed-loop systems adjust doses automatically based on CGM readings.",
    measurementEffort: "Low to moderate",
    measurementEffortDetail: "Smart pens and pumps log automatically. Manual injection with standard pens or syringes requires the person to remember and log the dose themselves.",
    frequencyCapability: "Per dose, multiple times daily",
    frequencyReality: "Intensive insulin therapy involves 4+ doses per day (1 long-acting, 3+ at meals). Pump users receive micro-doses continuously.",
    cognitiveLoad: "Technical for dosing decisions",
    cognitiveLoadDetail: "Recording the dose is simple (a number). But deciding the right dose requires understanding insulin-to-carb ratios, correction factors, and insulin on board. This is one of the most complex self-management tasks in all of medicine.",
    examples: [
      { value: "6 units of rapid-acting before dinner", meaning: "A meal bolus. This person estimated their carb intake and used their insulin-to-carb ratio to calculate 6 units. If their glucose goes high after dinner, they may need more next time. If it drops too low, they gave too much." },
      { value: "22 units of long-acting at bedtime", meaning: "A basal (background) dose that provides a steady low level of insulin over 24 hours. This keeps glucose stable between meals and overnight." },
    ],
    interpretation: "There is no 'right' dose that applies to everyone. Insulin needs are highly individual and change with food, activity, stress, illness, and hormonal cycles. The dose is a means to an end; the end is keeping glucose in range.",
    impactability: "Immediate effect on glucose",
    impactabilityDetail: "Rapid-acting insulin starts working in 15-30 minutes and peaks at 1-2 hours. Long-acting insulin works over 24 hours. Adjusting doses changes glucose levels directly. But incorrect adjustments can cause dangerous lows.",
    impactLevers: ["Dose adjustment (with clinical guidance)", "Carb counting accuracy", "Timing relative to meals", "Closed-loop pump systems that adjust automatically"],
    timeToImpact: "15-30 minutes for rapid-acting insulin. 2-4 hours for full effect.",
    domains: ["Medications", "Chronic condition management"],
    healthTags: ["Diabetes management", "Dose optimization", "Hypoglycemia prevention"],
    usedByScores: [
      { company: "Tandem/Dexcom", score: "Control-IQ closed-loop system" },
      { company: "Omnipod/Dexcom", score: "Omnipod 5 automated system" },
    ],
    whoSetsLogic: "The person's endocrinologist sets initial ratios and correction factors. The person makes day-to-day dosing decisions. Closed-loop systems increasingly make these decisions automatically using algorithms.",
    emotionalValence: "High",
    userReaction: "Insulin dosing carries real stakes: too much can cause a dangerous low, too little means high glucose and long-term complications. Many people with diabetes experience dosing anxiety. The math is constant. Closed-loop pump systems reduce this burden significantly.",
    dataQuality: "High (smart pens/pumps) / Moderate (manual logging)",
    trustDetail: "Smart pens and pumps record exact doses. Manual logging is only as accurate as the person's memory and diligence. Missing or inaccurate dose logs undermine the entire glucose-management picture.",
  },

  // ════════════════════════════════════════
  // BODY COMPOSITION
  // ════════════════════════════════════════

  {
    id: "weight", name: "Body weight",
    whatIsMeasured: "Your total body mass, in pounds or kilograms. The most commonly tracked health metric in the world. What a scale shows you is the sum of everything: muscle, fat, bone, organs, water, and the food currently in your digestive system.",
    source: "Home scale",
    sourceDetail: "Bathroom scale (basic) or smart scale with bioimpedance (Withings, Renpho). DEXA scan for clinical accuracy. Smart scales sync to apps automatically.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "Step on the scale. Takes 5 seconds. The friction is emotional, not practical.",
    frequencyCapability: "As often as you want",
    frequencyReality: "Daily weighers and weekly weighers are both common. Research shows daily weighing is associated with better weight management outcomes, but it requires emotional resilience to handle the noise.",
    cognitiveLoad: "Easy to understand, hard to interpret correctly",
    cognitiveLoadDetail: "Everyone understands pounds or kilograms. But most people don't understand that daily fluctuations of 2-4 lbs are normal (mostly water), and that day-to-day changes say nothing about fat loss or gain. The weekly or monthly trend is what matters.",
    examples: [
      { value: "172 lbs (down from 178 over 2 months)", meaning: "A healthy rate of loss (about 0.75 lb per week). Gradual enough to be mostly fat loss rather than muscle loss. Sustainable." },
      { value: "172 lbs yesterday, 175 lbs today", meaning: "Normal daily fluctuation. Almost certainly water, sodium, or digestive contents. Not fat gain. This 3 lb swing means nothing, but it feels terrible to many people." },
    ],
    interpretation: "BMI categories (underweight/normal/overweight/obese) are a rough screening tool. Weight alone doesn't distinguish between muscle and fat. A muscular 200-lb person and an inactive 200-lb person of the same height have very different health profiles. Trends over weeks matter. Single readings don't.",
    impactability: "Takes weeks to months to change meaningfully",
    impactabilityDetail: "Sustainable fat loss is 0.5-1 lb per week, requiring a consistent calorie deficit. Faster weight loss often means muscle loss, water loss, or unsustainable restriction. Muscle gain is even slower: 1-2 lbs per month for most people.",
    impactLevers: ["Calorie management", "Regular exercise (both cardio and strength)", "Sleep quality", "Stress management", "Dietary changes"],
    timeToImpact: "Daily fluctuations are noise. Real changes take 2-4 weeks to become visible on the scale. Body recomposition (losing fat and gaining muscle) may not change the scale number at all.",
    domains: ["Body composition", "Metabolic", "Risk"],
    healthTags: ["Obesity risk", "Metabolic health", "Cardiovascular risk", "Nutritional status"],
    usedByScores: [
      { company: "WHOOP", score: "WHOOP Age (lean body mass input)" },
      { company: "Most health apps", score: "BMI calculation, progress tracking" },
    ],
    whoSetsLogic: "BMI categories are set by WHO and CDC. 'Ideal weight' is a contested concept. Clinical focus is shifting toward waist circumference and body composition rather than weight alone.",
    emotionalValence: "High",
    userReaction: "One of the most emotionally loaded health metrics. Weight carries cultural baggage around body image, self-worth, and moral judgment. Many people have a fraught relationship with the scale. A 2-lb daily increase can ruin someone's morning. Seeing a plateau after weeks of effort is deeply discouraging. Products that show weight need to handle this number with extreme care: context, trend lines, and framing matter more here than for almost any other metric.",
    dataQuality: "Trustworthy",
    trustDetail: "Scales are accurate. The measurement is precise. The interpretation problem isn't accuracy; it's that the number is a blunt instrument that doesn't tell you what changed (fat? muscle? water? food in your stomach?).",
  },

  {
    id: "body_fat_pct", name: "Body fat percentage",
    whatIsMeasured: "What percentage of your total body mass is fat tissue. More informative than weight alone because it separates fat from everything else (muscle, bone, water). Two people at the same weight can have very different body fat percentages.",
    source: "Home smart scale or clinical scan",
    sourceDetail: "Smart scale bioimpedance (Withings, Renpho) is convenient but rough (accuracy varies 3-5%). DEXA scan at a clinic is the gold standard but expensive and infrequent. Skinfold calipers require training to use correctly.",
    measurementEffort: "Low (smart scale) to moderate (DEXA)",
    measurementEffortDetail: "Smart scale: step on, same as weighing yourself. DEXA scan: schedule an appointment, lie on a table for 10 minutes. Costs $75-150 per scan.",
    frequencyCapability: "Daily (smart scale) or every few months (DEXA)",
    frequencyReality: "Smart scale users see it daily. DEXA users check every 3-12 months. The daily smart scale number bounces around a lot due to hydration.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept is intuitive. But healthy ranges vary by age and sex, and most people don't know what's typical. Is 22% good? It depends entirely on context.",
    examples: [
      { value: "18% (athletic man)", meaning: "Lean. Visible muscle definition. Below average for the general population but common among regular exercisers." },
      { value: "35% (woman, age 50)", meaning: "Above the recommended range for health (generally under 32% for women). Associated with increased metabolic risk if combined with low muscle mass. But this number alone doesn't tell the full story." },
    ],
    interpretation: "Healthy ranges are roughly 10-20% for men and 18-28% for women, varying by age (higher ranges are normal with age). Athletes are typically lower. Very low body fat (under 5% men, under 15% women) is unhealthy and unsustainable. The trend over months matters more than any single reading from a smart scale.",
    impactability: "Takes months to change",
    impactabilityDetail: "Losing body fat requires sustained calorie deficit plus exercise. Gaining muscle (which lowers the percentage even at the same weight) requires resistance training and adequate protein. Neither happens quickly.",
    impactLevers: ["Calorie management", "Strength training", "Adequate protein", "Consistent exercise", "Sleep"],
    timeToImpact: "Months. Smart scale readings fluctuate daily with hydration, so wait at least 4 weeks before judging a trend.",
    domains: ["Body composition", "Metabolic", "Risk"],
    healthTags: ["Metabolic health", "Cardiovascular risk", "Athletic performance"],
    usedByScores: [
      { company: "Withings", score: "Body composition tracking" },
      { company: "WHOOP", score: "WHOOP Age (lean body mass)" },
    ],
    whoSetsLogic: "Clinical ranges exist but vary by source. The American Council on Exercise publishes commonly referenced categories. No single universal standard.",
    emotionalValence: "High",
    userReaction: "Similar emotional weight to body weight, plus the added complexity of the number being harder to understand. People can feel discouraged by a number they can't put in context. Smart scale body fat readings that bounce 3-5% day to day due to hydration cause unnecessary distress.",
    dataQuality: "Low (smart scale) to high (DEXA)",
    trustDetail: "Smart scale bioimpedance is affected by hydration, recent exercise, skin moisture, and foot placement. Day-to-day readings can vary 3-5% from the same person. DEXA scans are accurate to within about 1% but are expensive and infrequent. Use smart scale readings only for long-term trends (month over month), never for day-to-day comparison.",
  },

  {
    id: "waist_circumference", name: "Waist circumference",
    whatIsMeasured: "The distance around your waist at the level of your navel, measured with a tape measure. A simple, low-tech metric that is a better predictor of metabolic and cardiovascular risk than BMI because it reflects visceral fat (the dangerous fat around your organs) specifically.",
    source: "Self-measured or clinical visit",
    sourceDetail: "A measuring tape at the navel. No technology needed. Can be done at home in 10 seconds.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "Wrap a tape measure around your waist at the navel. Read the number. Takes less time than stepping on a scale.",
    frequencyCapability: "As often as you want",
    frequencyReality: "Rarely measured at home. Typically measured at doctor visits. Underutilized despite being a better risk indicator than BMI.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Inches or centimeters. Clear thresholds. Smaller is generally better.",
    examples: [
      { value: "34 inches (man)", meaning: "Below the risk threshold of 40 inches. Suggests relatively low visceral fat." },
      { value: "38 inches (woman)", meaning: "Above the risk threshold of 35 inches for women. Associated with increased risk of type 2 diabetes, cardiovascular disease, and metabolic syndrome, independent of total body weight." },
    ],
    interpretation: "Risk thresholds: over 40 inches for men, over 35 inches for women. Above these levels, the risk of metabolic syndrome, type 2 diabetes, and cardiovascular disease increases significantly. Waist-to-hip ratio adds further nuance. This measurement is arguably more useful than BMI for assessing metabolic risk.",
    impactability: "Takes months to change",
    impactabilityDetail: "Reducing waist circumference requires losing visceral fat, which responds well to exercise (especially aerobic) and dietary changes. Weight loss of even 5-10% can meaningfully reduce waist circumference.",
    impactLevers: ["Regular exercise (especially aerobic)", "Dietary changes", "Reducing refined carbs and alcohol", "Stress management (cortisol drives visceral fat storage)"],
    timeToImpact: "Weeks to months. Visceral fat responds faster to exercise than subcutaneous fat.",
    domains: ["Body composition", "Risk", "Metabolic"],
    healthTags: ["Visceral fat", "Metabolic syndrome", "Type 2 diabetes risk", "Cardiovascular risk"],
    usedByScores: [
      { company: "Quest Health", score: "Part of comprehensive health profiles" },
    ],
    whoSetsLogic: "NIH and WHO set the risk thresholds (40 inches men, 35 inches women). Well-established and evidence-based.",
    emotionalValence: "Moderate to high",
    userReaction: "Carries some of the same emotional weight as body weight. Seeing a number above the risk threshold can be motivating or distressing depending on how it's framed. The simplicity of the measurement (just a tape measure) makes it feel more accessible than lab tests.",
    dataQuality: "Trustworthy if measured consistently",
    trustDetail: "The measurement is only as good as the technique. Measuring at the same spot (navel), at the same time of day, with the same tension on the tape, gives reliable results. The margin of error is about half an inch from measurement to measurement.",
  },


  // ════════════════════════════════════════
  // NUTRITION & DIET
  // ════════════════════════════════════════

  {
    id: "calories_consumed", name: "Calories consumed",
    whatIsMeasured: "The total energy content of everything you ate and drank during the day, measured in kilocalories. The fundamental unit of dietary tracking.",
    source: "You log it",
    sourceDetail: "Manually entered via apps (MyFitnessPal, Cronometer, LoseIt). Barcode scanning and AI photo recognition reduce friction but accuracy still depends on portion estimation.",
    measurementEffort: "High effort",
    measurementEffortDetail: "Requires logging every meal and snack: searching for foods, estimating portions, entering quantities. Most people burn out within 2-3 weeks. Restaurant meals and home-cooked recipes are the hardest.",
    frequencyCapability: "Per meal, daily total",
    frequencyReality: "Committed trackers log daily. Most people try for a few weeks, then stop. Intermittent logging (tracking for a week every few months) can still be informative.",
    cognitiveLoad: "Easy to understand, hard to do accurately",
    cognitiveLoadDetail: "Everyone understands calories. But most people underestimate their intake by 20-40%. Portion estimation is a skill that takes practice.",
    examples: [
      { value: "1,850 calories", meaning: "Moderate intake. For an average-sized moderately active adult, this would be a slight deficit that could support gradual weight loss." },
      { value: "2,800 calories", meaning: "High intake for most adults unless very active. Easy to hit on a day with restaurant meals and snacking. One large restaurant entree can be 1,200+ calories alone." },
    ],
    interpretation: "There's no universal 'right' number. Calorie needs depend on your size, age, activity level, and goals. A rough starting point: body weight in pounds x 12-15 = maintenance calories for moderately active people. The value of tracking isn't hitting a precise number; it's building awareness of what you're actually eating.",
    impactability: "Directly changeable",
    impactabilityDetail: "Eat less, the number goes down. The challenge is sustaining it. Extreme restriction backfires. Moderate, consistent deficits work. Adding protein and fiber increases satiety, making lower calories easier to sustain.",
    impactLevers: ["Portion awareness", "Cooking at home", "More protein and fiber", "Fewer liquid calories", "Mindful eating"],
    timeToImpact: "Immediate. Eat less today, the number is lower today. The downstream health effects (weight change, metabolic improvement) take weeks to months.",
    domains: ["Nutrition", "Body composition"],
    healthTags: ["Weight management", "Metabolic health", "Energy balance"],
    usedByScores: [
      { company: "MyFitnessPal", score: "Daily calorie goal tracking" },
      { company: "Fitbit", score: "Food logging, calorie balance" },
    ],
    whoSetsLogic: "No single authority. USDA publishes Dietary Guidelines for Americans with general calorie ranges. Apps let you set personalized goals based on weight goals.",
    emotionalValence: "High",
    userReaction: "Calorie tracking can be empowering (awareness leads to better choices) or harmful (obsessive counting, guilt, disordered eating patterns). For people with a history of eating disorders, calorie tracking can be a trigger. Products that include calorie tracking should consider offering alternatives (food quality tracking, habit-based goals) for people who don't do well with numbers.",
    dataQuality: "Low to moderate",
    trustDetail: "Only as accurate as the person's logging. Studies consistently show people underestimate intake by 20-40%. Food database entries can be wrong. Portion estimation is the biggest source of error. The data is useful for relative awareness ('I ate a lot more today than yesterday') but should not be treated as precise.",
  },

  {
    id: "protein_grams", name: "Protein intake (grams)",
    whatIsMeasured: "How many grams of protein you consumed in a day. Protein is the macronutrient responsible for building and maintaining muscle, and it's the most satiating (keeps you feeling full).",
    source: "You log it",
    sourceDetail: "Calculated from food logging in nutrition apps. Requires knowing the protein content of what you eat.",
    measurementEffort: "High effort",
    measurementEffortDetail: "Same effort as calorie tracking. Protein is calculated as part of the food logging process.",
    frequencyCapability: "Daily",
    frequencyReality: "Tracked alongside calories by people who log food. Protein-specific tracking is increasingly popular among fitness-focused people.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Grams. More is generally better for most people (up to a point). The common recommendation of 0.7-1g per pound of body weight is easy to remember.",
    examples: [
      { value: "140 grams", meaning: "Strong intake for most adults. This person is likely prioritizing protein-rich foods (meat, fish, eggs, dairy, legumes) at every meal. Good for maintaining or building muscle." },
      { value: "45 grams", meaning: "Low for an adult. Common in people who eat mostly carb-heavy meals without much meat or other protein sources. May contribute to muscle loss over time, especially after age 40." },
    ],
    interpretation: "The RDA (0.36g per pound) is a minimum to prevent deficiency, not an optimal amount. Most nutrition and exercise scientists recommend 0.7-1g per pound of body weight for active adults and older adults. Protein becomes increasingly important after age 40 to prevent age-related muscle loss (sarcopenia).",
    impactability: "Directly changeable",
    impactabilityDetail: "Eat more protein-rich foods. Add protein to every meal. Use protein supplements if needed. This is one of the most actionable nutrition changes.",
    impactLevers: ["Add protein to every meal", "Choose protein-rich snacks", "Protein supplements if needed", "Distribute intake across the day (30-40g per meal is better than 100g in one meal)"],
    timeToImpact: "Immediate change in daily intake. Muscle-related benefits take weeks to months.",
    domains: ["Nutrition", "Body composition", "Longevity"],
    healthTags: ["Muscle maintenance", "Satiety", "Body composition", "Sarcopenia prevention", "Recovery"],
    usedByScores: [
      { company: "MyFitnessPal", score: "Macro tracking" },
      { company: "Cronometer", score: "Nutrient targets" },
    ],
    whoSetsLogic: "The RDA is set by the National Academy of Medicine. Higher recommendations come from sports nutrition research and increasingly from longevity-focused physicians. There's growing consensus the RDA is too low for optimal health.",
    emotionalValence: "Low",
    userReaction: "Protein tracking is one of the least emotionally loaded nutrition metrics. People generally feel positive about hitting their protein goal. It feels like adding something good rather than restricting something bad.",
    dataQuality: "Low to moderate",
    trustDetail: "Same accuracy limitations as calorie tracking. The protein content of whole foods is well-characterized, but portion estimation introduces error. Restaurant meals are the hardest to estimate accurately.",
  },

  {
    id: "water_intake", name: "Water / fluid intake",
    whatIsMeasured: "How much water and other fluids you drank during the day, in ounces or liters.",
    source: "You log it",
    sourceDetail: "Manually logged via apps or smart water bottles (HidrateSpark). No reliable passive measurement exists.",
    measurementEffort: "Moderate effort",
    measurementEffortDetail: "Log each glass or bottle throughout the day. Smart water bottles track automatically but only count what you drink from them. Forgetfulness is the main obstacle.",
    frequencyCapability: "Per drink throughout the day",
    frequencyReality: "People who track water usually do it for a few weeks. Compliance drops off quickly because the effort-to-insight ratio is low.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Ounces or liters. Drink more. Simple.",
    examples: [
      { value: "80 oz (2.4 liters)", meaning: "Good hydration for most adults. Above the general guideline of 64 oz. Actual needs vary by body size, climate, and activity." },
      { value: "24 oz", meaning: "Low. This person is likely mildly dehydrated, which can cause fatigue, headaches, and reduced cognitive performance." },
    ],
    interpretation: "The 'eight glasses a day' rule is a rough guideline, not science. Actual needs vary widely. A simple check: if your urine is pale yellow, you're probably hydrated enough. Dark yellow means drink more. Thirst is a reasonable guide for most healthy adults.",
    impactability: "Directly changeable",
    impactabilityDetail: "Drink more water. Keep a bottle at your desk. Set reminders. This is one of the simplest health changes.",
    impactLevers: ["Keep water bottle visible", "Set reminders", "Drink a glass with every meal", "Replace sugary drinks with water"],
    timeToImpact: "Immediate.",
    domains: ["Nutrition"],
    healthTags: ["Hydration", "Kidney function", "Cognitive performance", "Exercise performance"],
    usedByScores: [
      { company: "Fitbit", score: "Water logging" },
    ],
    whoSetsLogic: "The National Academy of Medicine suggests about 3.7 liters/day for men and 2.7 for women (from all sources including food). The '8 glasses' rule is cultural, not clinical.",
    emotionalValence: "Neutral",
    userReaction: "People generally feel positive about drinking more water. Low emotional stakes. The main reaction is mild guilt when they realize they haven't been drinking enough.",
    dataQuality: "Low",
    trustDetail: "Entirely dependent on self-reporting. Most people forget to log multiple drinks throughout the day. Smart bottles only capture water from that specific container. The data is a rough estimate at best.",
  },

  {
    id: "alcohol_drinks", name: "Alcohol intake (standard drinks)",
    whatIsMeasured: "How many standard drinks you consumed. One standard drink is 14 grams of pure alcohol: about one 12 oz beer, 5 oz glass of wine, or 1.5 oz shot of liquor.",
    source: "You log it",
    sourceDetail: "Self-reported via apps or journals. WHOOP's journal feature lets you log alcohol and see the correlation with sleep, HRV, and recovery the next day.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "Count your drinks. Easy to do in the moment, easy to undercount after the fact.",
    frequencyCapability: "Per occasion",
    frequencyReality: "Logged when drinking. People who use WHOOP often log alcohol specifically to see the recovery impact.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Number of drinks. Everyone understands this. But many people don't realize how much a 'standard drink' actually is (a large pour of wine is often 2 standard drinks, not 1).",
    examples: [
      { value: "0 drinks", meaning: "No alcohol. WHOOP and Oura users consistently report that their best recovery and sleep scores come on nights without alcohol." },
      { value: "3 drinks", meaning: "Moderate-to-heavy for a single evening. Expect visibly worse sleep data the next morning: suppressed deep sleep and REM, elevated resting heart rate, lower HRV. The effects show up clearly on every wearable." },
    ],
    interpretation: "Alcohol is the most consistently visible disruptor in wearable recovery data. Even 1-2 drinks suppresses deep sleep and REM, elevates resting heart rate, and lowers HRV. The effects are dose-dependent and clearly visible the next morning. Current guidelines suggest no more than 1 drink/day for women and 2 for men. Some recent research suggests no amount is truly 'safe.'",
    impactability: "Directly changeable",
    impactabilityDetail: "Drink less or not at all. Simple to understand, hard for many people to change because alcohol is deeply integrated into social life.",
    impactLevers: ["Drink less", "Choose lower-alcohol options", "Alternate with water", "Alcohol-free days per week"],
    timeToImpact: "Immediate. Skip alcohol tonight, sleep better tonight. Wearable data shows the effect the very next morning.",
    domains: ["Nutrition", "Sleep", "Recovery", "Risk"],
    healthTags: ["Sleep quality", "Recovery", "Liver health", "Cardiovascular risk", "Cancer risk"],
    usedByScores: [
      { company: "WHOOP", score: "Journal correlation with Recovery" },
      { company: "Oura", score: "Sleep score (alcohol effect visible in data)" },
    ],
    whoSetsLogic: "CDC and WHO set consumption guidelines. Wearable companies don't set alcohol limits but make the effects visible through data.",
    emotionalValence: "Moderate",
    userReaction: "Seeing the data impact of alcohol is often a surprise and a powerful motivator. 'I had no idea 2 glasses of wine did that to my sleep' is a common reaction. Some people reduce drinking after seeing the data. Others feel judged by their device and stop logging. The cultural role of alcohol makes this a sensitive topic for products to handle.",
    dataQuality: "Low",
    trustDetail: "Self-reported and prone to undercounting. Most people underestimate how much they drink, especially with wine (a large pour is 2 standard drinks). The indirect signal from wearable data (suppressed HRV, elevated RHR) is actually more reliable than the self-report.",
  },

  // ════════════════════════════════════════
  // MEDICATION
  // ════════════════════════════════════════

  {
    id: "med_taken", name: "Medication taken (yes/no per dose)",
    whatIsMeasured: "Whether you took your prescribed medication at the right time. The simplest possible adherence signal: did you take it or not?",
    source: "You report it, or smart pill bottle",
    sourceDetail: "Self-report, app reminders (Medisafe, Dosecast), smart pill bottles (which detect when opened but not whether the pill was taken), or inferred indirectly from pharmacy fill dates.",
    measurementEffort: "Low effort (but easy to forget)",
    measurementEffortDetail: "Tap a button in an app when you take your medication. Takes 2 seconds. The challenge isn't effort; it's remembering to do it, especially when taking multiple medications at different times.",
    frequencyCapability: "Per dose, 1-4+ times per day",
    frequencyReality: "Many people intend to track but forget to log. Pill organizers and reminders help. The most reliable tracking comes from smart pill bottles or closed-loop systems, not self-report.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Yes or no. Did you take it? Completely intuitive.",
    examples: [
      { value: "Taken, 8:02 AM", meaning: "On schedule. The medication is working as intended because the person is taking it consistently." },
      { value: "Missed (3rd time this week)", meaning: "Pattern of non-adherence. For blood pressure medication, this means blood pressure is uncontrolled for those days. For statins, cholesterol protection drops. For diabetes medication, glucose rises. Depending on the medication, missing doses can be anywhere from inconvenient to dangerous." },
    ],
    interpretation: "Up to 50% of patients with chronic conditions don't take their medications as prescribed. The gap between 'I have a prescription' and 'I actually take it correctly every day' is one of the biggest challenges in healthcare. Non-adherence costs the US healthcare system an estimated $100-300 billion per year in avoidable hospitalizations and complications.",
    impactability: "Directly changeable",
    impactabilityDetail: "Use a pill organizer. Set phone reminders. Link medication to an existing habit (always take it with breakfast). Simplify the regimen (ask your doctor about once-daily options). Remove barriers (mail-order pharmacy, 90-day fills).",
    impactLevers: ["Pill organizer", "Phone reminders", "Habit stacking (take with breakfast)", "Simplify regimen", "90-day supplies", "Automatic refills"],
    timeToImpact: "Immediate. Take the pill, it starts working today. The clinical effects of consistent adherence show up in lab results within weeks to months.",
    domains: ["Medications", "Chronic condition management", "Risk"],
    healthTags: ["Treatment effectiveness", "Disease progression", "Hospitalization risk"],
    usedByScores: [
      { company: "Health plans", score: "CMS Star Ratings (medication adherence PDC)" },
      { company: "Medisafe", score: "Adherence score" },
    ],
    whoSetsLogic: "Clinical guidelines define what 'adherent' means (typically 80%+ of days covered). CMS uses the Proportion of Days Covered (PDC) metric. The prescribing doctor sets the regimen.",
    emotionalValence: "Low to moderate",
    userReaction: "Most people feel mildly guilty when they miss a dose but not distressed. For people on life-critical medications (organ rejection drugs, HIV antiretrovirals), missing doses carries real fear. For people who stopped medications due to side effects, the 'did you take it' question can feel accusatory if the product doesn't acknowledge that the medication itself might be the problem.",
    dataQuality: "Low (self-report) to moderate (smart bottles)",
    trustDetail: "Self-reported adherence is systematically overestimated. People report higher adherence than pharmacy fill data supports. Smart pill bottles are more reliable but only detect that the bottle was opened, not that the pill was taken. Pharmacy fill dates (did you pick up your refill?) are the most scalable signal but still indirect.",
  },

  {
    id: "med_side_effects", name: "Medication side effects (self-reported)",
    whatIsMeasured: "Symptoms the person believes are caused by their medication. This is one of the top reasons people stop taking medications, often without telling their doctor.",
    source: "You report it",
    sourceDetail: "Self-reported via patient portals, apps, or at clinical visits. Rarely tracked systematically outside of clinical trials.",
    measurementEffort: "Low effort (when prompted)",
    measurementEffortDetail: "Describe what you're experiencing. The effort is low; the barrier is that most systems don't ask. When apps or portals prompt for side effects, people report them. When nobody asks, the side effects just become a reason to stop the medication.",
    frequencyCapability: "As symptoms occur",
    frequencyReality: "Most people don't report side effects until asked at a follow-up visit (which may be months away) or until the side effects are bad enough that they stop taking the medication entirely.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "Describe how you feel. No interpretation needed.",
    examples: [
      { value: "Muscle aches since starting statin", meaning: "A common statin side effect. If reported early, the doctor can try a different statin or adjust the dose. If not reported, the person often just stops the statin, losing the cardiovascular protection without the doctor knowing." },
      { value: "Dizziness and frequent urination since starting blood pressure medication", meaning: "Could be the diuretic component. Reporting this lets the doctor switch to a different class. Not reporting it leads to a common pattern: person stops medication, blood pressure climbs, and nobody realizes why until the next visit months later." },
    ],
    interpretation: "Side effects are the leading reason people stop taking chronic medications. The critical product design insight: capturing side effects early (within the first 2-4 weeks of a new medication) can prevent dangerous gaps in treatment. A simple 'how are you feeling on your new medication?' prompt at the right time can save lives.",
    impactability: "Actionable by the care team",
    impactabilityDetail: "The person can't fix their own side effects, but reporting them enables the doctor to adjust. Most side effects have alternatives: a different drug in the same class, a lower dose, or a different class entirely.",
    impactLevers: ["Report side effects to your doctor", "Ask about alternatives", "Don't stop medications without discussing with your doctor first"],
    timeToImpact: "Reporting is immediate. Medication adjustment takes a doctor visit (days to weeks).",
    domains: ["Medications", "Symptoms"],
    healthTags: ["Medication adherence", "Treatment adjustment", "Patient safety", "Quality of life"],
    usedByScores: [],
    whoSetsLogic: "No one systematically scores this today. It's a gap. Clinical trials track side effects rigorously; real-world care largely doesn't.",
    emotionalValence: "Moderate",
    userReaction: "People often feel resigned about side effects ('I guess this is just how it is now'). Some feel frustrated that the medication that's supposed to help them makes them feel worse. A product that actively asks about side effects and connects the person to their care team can transform this from a silent problem into a solvable one.",
    dataQuality: "Low but valuable",
    trustDetail: "Subjective and self-reported. The person may attribute symptoms to their medication that have a different cause. But even imperfect side effect data is far more useful than no data, which is what most healthcare systems currently have.",
  },

  // ════════════════════════════════════════
  // MENTAL HEALTH & STRESS
  // ════════════════════════════════════════

  {
    id: "mood_rating", name: "Mood rating (self-reported)",
    whatIsMeasured: "Your self-assessed emotional state, recorded on a simple scale (1-10, or using labels like great/good/okay/bad/terrible). A subjective snapshot of how you feel at a particular moment.",
    source: "You log it",
    sourceDetail: "Apps (Daylio, Bearable, How We Feel) or prompted by wearable apps. Some apps offer 5-point scales with emoji; others use validated clinical instruments.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "Tap a number or emoji. Takes 5 seconds. The challenge is remembering to do it consistently, especially when you're feeling bad (which is when the data is most valuable).",
    frequencyCapability: "Multiple times per day",
    frequencyReality: "1-2 times per day for committed trackers. Most people do it for a few weeks then taper off.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "How do you feel? Rate it. No interpretation needed.",
    examples: [
      { value: "7/10 (Thursday afternoon)", meaning: "A good day. Nothing remarkable. This is the baseline to compare against." },
      { value: "3/10 (three consecutive days)", meaning: "A sustained low mood. Three or more days of low ratings is more meaningful than a single bad day. Patterns over weeks can reveal connections to sleep, exercise, social contact, or seasonal changes." },
    ],
    interpretation: "Individual ratings are less useful than patterns. Correlating mood with sleep data, exercise, social activities, and work stress can reveal triggers and supports that the person wasn't aware of. A sustained downward trend (multiple weeks of low ratings) is a signal to consider professional support.",
    impactability: "Indirectly changeable",
    impactabilityDetail: "You can't directly decide to feel better. But sleep, exercise, social connection, time outdoors, and reducing alcohol all reliably improve mood over time. Therapy and medication are effective for persistent low mood.",
    impactLevers: ["Better sleep", "Regular exercise", "Social connection", "Time outdoors", "Reducing alcohol", "Therapy", "Medication if appropriate"],
    timeToImpact: "Exercise can improve mood within hours. Sleep improvements show within days. Therapy and medication: weeks.",
    domains: ["Stress", "Symptoms"],
    healthTags: ["Mental health", "Depression screening", "Treatment monitoring", "Quality of life"],
    usedByScores: [],
    whoSetsLogic: "No universal standard for consumer mood tracking. Clinical instruments (PHQ-9, GAD-7) have validated scoring. Consumer apps use their own scales.",
    emotionalValence: "Moderate",
    userReaction: "The act of rating your mood can itself be helpful: it creates a moment of self-awareness. But on bad days, being prompted to rate your mood can feel annoying ('I know I feel terrible, thanks for reminding me'). Products should offer opt-out on difficult days without guilt.",
    dataQuality: "Low (subjective)",
    trustDetail: "Entirely subjective and influenced by the moment. A rating given during a stressful meeting will look very different from one taken 30 minutes later. The value is in patterns over weeks, not individual data points.",
  },

  {
    id: "stress_physio", name: "Physiological stress level (device-measured)",
    whatIsMeasured: "Your body's stress response, estimated from heart rate variability patterns throughout the day. This is not the same as how stressed you feel. Your body may be physiologically stressed from exercise, caffeine, or coming down with something even when you feel calm.",
    source: "Wearable sensor",
    sourceDetail: "Garmin (All-Day Stress), Samsung (Stress), Fitbit (Stress Management Score). Derived from HRV patterns during the day.",
    measurementEffort: "No effort to collect",
    measurementEffortDetail: "Continuous and automatic. Wear the device and it tracks stress throughout the day.",
    frequencyCapability: "Continuous throughout the day",
    frequencyReality: "Updated continuously. Most people check it when they feel stressed to see if the device agrees, or notice it in their daily summary.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept of physiological stress vs. perceived stress isn't intuitive. Many people are confused when the device says they're stressed but they feel fine, or when they feel anxious but the device shows calm. Understanding that the device measures body strain (not emotional state) takes some learning.",
    examples: [
      { value: "Stress: 28 (Garmin, low)", meaning: "The body is in a relaxed, parasympathetic state. Heart rate variability is high. This might be during a calm morning or after meditation." },
      { value: "Stress: 78 (Garmin, high)", meaning: "The body is under significant strain. Could be a hard workout, a tense meeting, too much caffeine, fighting off illness, or a combination. If this stays high all day with no obvious physical cause, chronic stress or burnout may be developing." },
    ],
    interpretation: "Intermittent high stress is normal and healthy (exercise, work deadlines). Sustained high stress without recovery periods is the concern. The most useful pattern: looking at overnight stress. If your body doesn't relax during sleep, something is off. Garmin shows this as overnight Body Battery recharging (or not).",
    impactability: "Indirectly changeable",
    impactabilityDetail: "You can't directly lower physiological stress. You can address the causes: better sleep, less caffeine, exercise recovery, breathing exercises, and reducing life stressors. The device shows whether your interventions are working.",
    impactLevers: ["Better sleep", "Reduce caffeine", "Breathing exercises", "Exercise recovery", "Address life stressors"],
    timeToImpact: "Breathing exercises can lower measured stress within minutes. Sustained improvement takes days to weeks.",
    domains: ["Stress", "Recovery", "Heart health"],
    healthTags: ["Stress management", "Burnout prevention", "Cardiovascular health", "Recovery"],
    usedByScores: [
      { company: "Garmin", score: "All-Day Stress, Body Battery drain" },
      { company: "Samsung", score: "Stress score" },
      { company: "Fitbit", score: "Stress Management Score" },
    ],
    whoSetsLogic: "Each device company defines its own stress scale and thresholds. There's no clinical standard for consumer stress scores. The underlying measurement (HRV-derived autonomic balance) is well-established in physiology.",
    emotionalValence: "Moderate",
    userReaction: "Some people find stress tracking validating ('my body is confirming what I already feel'). Others find it stressful to see a high stress reading, creating a feedback loop. The mismatch between felt stress and measured stress can be confusing or enlightening depending on the person.",
    dataQuality: "Moderate",
    trustDetail: "The HRV-based stress estimate is physiologically grounded and generally reliable for trends. But many things affect HRV besides emotional stress: caffeine, digestion, body position, and recent exercise. The device can't distinguish between 'stressed from a deadline' and 'stressed because I just had an espresso.' Trends over days are more meaningful than momentary readings.",
  },

  {
    id: "pain_level", name: "Pain level (0-10 scale)",
    whatIsMeasured: "How much pain you're in right now, rated on a scale from 0 (none) to 10 (worst imaginable). Location, quality (sharp, dull, burning), and triggers are often tracked alongside intensity.",
    source: "You report it",
    sourceDetail: "Apps (PainScale), paper diaries, or at clinical visits. Visual Analog Scale and Brief Pain Inventory are validated clinical instruments.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "Rate your pain on a scale. Takes a few seconds. Location and quality logging takes a bit more time.",
    frequencyCapability: "As often as pain occurs",
    frequencyReality: "Daily for chronic pain patients. Per-episode for others. Consistency is key for seeing patterns.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A 0-10 scale. Everyone understands this from hospital visits.",
    examples: [
      { value: "3/10 (consistent low back pain, daily)", meaning: "Manageable but persistent. Not disabling but always present. The longitudinal record is valuable for the doctor to see: is it stable, improving, or getting worse?" },
      { value: "8/10 (migraine episode)", meaning: "Severe. Disabling in the moment. Tracking timing, triggers, and duration of episodes this severe helps identify patterns (hormonal, dietary, stress-related) and evaluate whether treatment is working." },
    ],
    interpretation: "Pain is subjective by definition. The same injury produces very different ratings from different people. The value is in tracking one person's pain over time to detect trends and treatment response. A drop from a consistent 6 to a consistent 4 after starting physical therapy is meaningful even though '4' is still pain.",
    impactability: "Depends on the cause",
    impactabilityDetail: "Acute pain (injury, surgery): improves with healing and treatment over days to weeks. Chronic pain: complex, may involve medication, physical therapy, psychological approaches, and lifestyle changes. Some chronic pain conditions are managed rather than cured.",
    impactLevers: ["Medical treatment", "Physical therapy", "Medication adjustment", "Stress management", "Sleep improvement", "Movement and exercise (often counterintuitively helpful)"],
    timeToImpact: "Acute pain: days to weeks. Chronic pain management: weeks to months to find the right approach.",
    domains: ["Symptoms", "Function / quality of life", "Chronic condition management"],
    healthTags: ["Chronic pain", "Treatment effectiveness", "Functional capacity", "Quality of life"],
    usedByScores: [],
    whoSetsLogic: "Clinical pain scales (NRS, VAS) are standardized. There's no clinical body that sets a 'target' pain level because pain management is individualized.",
    emotionalValence: "High",
    userReaction: "Pain is inherently distressing. Being asked to rate it can feel validating ('someone cares about my pain') or frustrating ('a number doesn't capture what this feels like'). For chronic pain patients, seeing consistently high numbers can reinforce a sense of helplessness. Products should present pain data in the context of trends and treatment progress, not as a static score.",
    dataQuality: "Low (subjective) but clinically valuable",
    trustDetail: "Pain ratings are subjective and not comparable between people. But they are useful for tracking one person's trajectory over time. Patterns (time of day, activities that trigger pain, response to treatment) are the most valuable data that emerge from consistent tracking.",
  },

  {
    id: "depression_score", name: "Depression symptom score (PHQ-9)",
    whatIsMeasured: "Your responses to 9 standardized questions about the past two weeks, covering mood, energy, sleep, appetite, concentration, self-worth, and suicidal thoughts. The most widely used depression screening instrument in clinical practice.",
    source: "You complete a questionnaire",
    sourceDetail: "Paper or digital questionnaire. Available in most EHR patient portals and mental health apps. Routinely administered in primary care.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "9 questions, about 2 minutes to complete. Typically prompted by a doctor, therapist, or app at regular intervals.",
    frequencyCapability: "Can be completed anytime",
    frequencyReality: "Every 2-4 weeks in therapy or clinical monitoring. Some apps prompt weekly or monthly.",
    cognitiveLoad: "Easy to complete, moderate to interpret",
    cognitiveLoadDetail: "The questions are straightforward ('how often have you felt little interest or pleasure in doing things?'). The resulting score (0-27) requires context to interpret: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe.",
    examples: [
      { value: "Score: 6 (mild)", meaning: "Some depressive symptoms are present but not disabling. Worth monitoring. May benefit from lifestyle changes or watchful waiting. If this was previously higher, it may indicate improvement." },
      { value: "Score: 18 (moderately severe)", meaning: "Significant depression that likely needs professional treatment (therapy, medication, or both). This score typically prompts clinical action." },
    ],
    interpretation: "The PHQ-9 is a screening tool, not a diagnosis. A high score suggests depression is likely and warrants clinical evaluation. A low score doesn't guarantee the absence of depression. The score is most useful for tracking change over time: a drop from 18 to 10 over 8 weeks of treatment shows the treatment is working.",
    impactability: "Takes weeks to months with treatment",
    impactabilityDetail: "Depression is treatable. Therapy (especially CBT) and medication (SSRIs, SNRIs) are both effective. Exercise, sleep improvement, and social connection also help. Most treatments take 4-8 weeks to show full effect.",
    impactLevers: ["Therapy (CBT is most studied)", "Medication if appropriate", "Regular exercise", "Sleep improvement", "Social connection", "Routine and structure"],
    timeToImpact: "Medication: 2-6 weeks for initial effect, 8-12 for full effect. Therapy: variable, often 6-12 sessions to see meaningful change. Exercise: acute mood lift within hours, sustained effect over weeks.",
    domains: ["Stress", "Symptoms", "Function / quality of life"],
    healthTags: ["Depression screening", "Treatment monitoring", "Suicide risk assessment", "Medication adjustment"],
    usedByScores: [],
    whoSetsLogic: "Developed by Drs. Kroenke and Spitzer. Validated extensively in clinical research. Scoring thresholds are standardized and universally used in clinical practice.",
    emotionalValence: "High",
    userReaction: "Completing a depression questionnaire can be emotionally difficult. Some people find it validating ('my experience is recognized'). Others find it triggering, especially the question about suicidal thoughts. A high score can be frightening. Products that administer the PHQ-9 need clear pathways to support: what to do with the result, where to get help, and reassurance that a high score is not a permanent label.",
    dataQuality: "High (validated instrument)",
    trustDetail: "The PHQ-9 is one of the most validated instruments in mental health. It has strong sensitivity and specificity for detecting major depressive disorder. It's a self-report tool, so honesty is required, and some people underreport symptoms due to stigma. Despite this, it's considered the standard of care for depression screening.",
  },

  // ════════════════════════════════════════
  // REPRODUCTIVE HEALTH
  // ════════════════════════════════════════

  {
    id: "cycle_length", name: "Menstrual cycle length (days)",
    whatIsMeasured: "The number of days from the first day of one period to the first day of the next. A fundamental metric for understanding reproductive health, hormonal patterns, and fertility.",
    source: "You log it, sometimes with sensor assist",
    sourceDetail: "Period tracking apps (Flo, Clue, Apple Health). Oura Ring and Apple Watch add temperature-based predictions that reduce reliance on manual logging.",
    measurementEffort: "Low effort",
    measurementEffortDetail: "Log when your period starts. The app calculates cycle length. If using a wearable with temperature tracking, the device can help predict and confirm cycle events.",
    frequencyCapability: "Once per cycle (monthly-ish)",
    frequencyReality: "Most people log period start dates consistently. Detailed daily symptom logging is less consistent.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A number of days. Regular cycles are 21-35 days. Straightforward.",
    examples: [
      { value: "28 days (consistent for 6 months)", meaning: "Regular cycle. The hormonal system is functioning predictably. Makes fertility planning (both conceiving and avoiding) more reliable." },
      { value: "Ranging from 22 to 45 days", meaning: "Irregular cycles. Could indicate PCOS, thyroid dysfunction, stress, excessive exercise, or perimenopause (if age-appropriate). Worth discussing with a doctor if the pattern persists." },
    ],
    interpretation: "Normal range is 21-35 days. Variation of a few days cycle to cycle is normal. Consistently irregular cycles (varying by more than 7-9 days) or very long cycles (over 35 days) may indicate a hormonal issue. Tracking over 6+ months builds a reliable picture.",
    impactability: "Indirectly changeable",
    impactabilityDetail: "You can't directly control cycle length. But factors that disrupt it (extreme exercise, very low body fat, chronic stress, poor nutrition) can be addressed. Hormonal birth control regulates cycle length artificially. Underlying conditions (PCOS, thyroid) can be treated.",
    impactLevers: ["Address extreme exercise or low body weight", "Stress management", "Treat underlying conditions (PCOS, thyroid)", "Hormonal birth control (regulates artificially)"],
    timeToImpact: "Months. Hormonal patterns take several cycles to shift.",
    domains: ["Reproductive health"],
    healthTags: ["Fertility", "Hormonal health", "PCOS screening", "Perimenopause"],
    usedByScores: [
      { company: "Flo", score: "Cycle predictions, fertility window" },
      { company: "Oura", score: "Cycle Insights" },
      { company: "Natural Cycles", score: "Fertility prediction (FDA-cleared)" },
    ],
    whoSetsLogic: "ACOG (American College of Obstetricians and Gynecologists) defines normal cycle parameters. App predictions use statistical models trained on population data.",
    emotionalValence: "Moderate to high",
    userReaction: "For people trying to conceive, every cycle length is scrutinized with hope and anxiety. For people tracking for health awareness, it's generally neutral. Irregular cycles can cause worry. The intersection of reproductive health data with privacy concerns (especially post-Dobbs) adds a layer of anxiety about data security that doesn't exist for most other health metrics.",
    dataQuality: "Moderate to high",
    trustDetail: "If the person logs period start dates accurately, cycle length is precise. Predictions for future cycles are based on historical patterns and are less reliable for people with irregular cycles. Temperature-based wearable data improves prediction accuracy.",
  },

  // ════════════════════════════════════════
  // LAB / BLOODWORK
  // ════════════════════════════════════════

  {
    id: "a1c", name: "Hemoglobin A1C",
    whatIsMeasured: "Your average blood glucose over the past 2-3 months, expressed as a percentage. It works by measuring how much glucose has attached to the hemoglobin in your red blood cells. Higher percentage means higher average glucose.",
    source: "Lab blood draw",
    sourceDetail: "Venous blood draw at a lab, or point-of-care finger prick at a doctor's office. Does not require fasting. Can be affected by certain anemias and hemoglobin variants, giving misleading results in some populations.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a blood draw at a lab or doctor visit. You get the result days later, not in the moment. The number reflects the past 90 days, so it's backward-looking.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Every 3-6 months for people with diabetes. Annually for screening in others.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The percentage scale is well-known among people with diabetes (they know their number). For others, the thresholds need explanation. Most people don't intuitively understand what '6.8%' means about their daily glucose experience.",
    examples: [
      { value: "5.4%", meaning: "Normal. Average glucose has been well-regulated over the past 3 months. No diabetes concern." },
      { value: "8.2%", meaning: "Above the typical diabetes target of under 7%. This person's average glucose has been high. Their treatment plan likely needs adjustment: more medication, dietary changes, or both. This level sustained over years increases risk of complications (eye, kidney, nerve damage)." },
    ],
    interpretation: "Under 5.7%: normal. 5.7-6.4%: pre-diabetes. 6.5%+: diabetes (on two separate tests). For people already diagnosed, the target is typically under 7%, though this is individualized. A1C is the clinical standard, but its limitation is that it's an average. Two people with A1C of 7% can have very different daily patterns: one is stable, the other swings between dangerous highs and lows. This is why CGM and Time in Range are gaining traction as complementary metrics.",
    impactability: "Takes months to change",
    impactabilityDetail: "Because A1C reflects 90 days of glucose, nothing you do today shows up until next quarter. Sustained dietary changes, medication adherence, regular exercise, and weight loss all move A1C over time. Medication (metformin, insulin) can start working within weeks, but the A1C number takes 2-3 months to reflect the change.",
    impactLevers: ["Dietary changes (reducing refined carbs and sugar)", "Medication adherence", "Regular exercise", "Weight loss", "Better sleep", "Stress management"],
    timeToImpact: "2-3 months minimum. The test reflects the prior 90 days.",
    domains: ["Labs", "Metabolic", "Chronic condition management"],
    healthTags: ["Diabetes management", "Pre-diabetes screening", "Cardiovascular risk", "Kidney risk"],
    usedByScores: [
      { company: "Health plans", score: "CMS Star Ratings (blood glucose control measure)" },
      { company: "InsideTracker", score: "InnerAge" },
    ],
    whoSetsLogic: "American Diabetes Association sets the diagnostic thresholds and treatment targets. These are well-established, evidence-based, and universally used in clinical practice.",
    emotionalValence: "High for people with diabetes",
    userReaction: "For people managing diabetes, A1C is 'the number.' A good result at a quarterly visit feels like a report card you passed. A bad result feels like failure, often accompanied by shame, especially if the person feels they've been trying hard. Doctors who lead with 'your A1C is high' before asking 'what's been going on in your life?' miss the human context. For people in the pre-diabetes range, the result is often a wake-up call that motivates change.",
    dataQuality: "High",
    trustDetail: "A1C is a well-validated clinical test with excellent reliability. The main caveat: it can be misleading in people with certain hemoglobin variants (more common in Black, Southeast Asian, and Mediterranean populations) or anemias. In these cases, fructosamine or glycated albumin tests may be more accurate.",
  },

  {
    id: "ldl", name: "LDL cholesterol",
    whatIsMeasured: "The amount of low-density lipoprotein ('bad' cholesterol) in your blood, measured in milligrams per deciliter. LDL particles deposit cholesterol in artery walls, building up plaque over decades. This is the primary driver of atherosclerosis.",
    source: "Lab blood draw",
    sourceDetail: "Part of a lipid panel. Fasting blood draw preferred for accuracy, though non-fasting panels are increasingly accepted for screening.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a lab visit and blood draw. Often requires fasting for 9-12 hours beforehand. Results in 1-3 days.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Every 1-5 years depending on age and risk factors. Annually if on a statin.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "Most people know 'LDL is the bad one.' But understanding whether their specific number (e.g., 128 mg/dL) is a problem requires knowing their overall risk profile. The thresholds for treatment depend on other factors (diabetes, family history, smoking).",
    examples: [
      { value: "92 mg/dL", meaning: "Below 100, which is the general target for most adults. Good. For someone at high cardiovascular risk, a target under 70 might be recommended." },
      { value: "165 mg/dL", meaning: "Elevated. Whether this triggers medication depends on the person's overall risk. For someone with no other risk factors, lifestyle changes might be the first step. For someone with diabetes or a family history of heart disease, a statin would likely be recommended." },
    ],
    interpretation: "Under 100: desirable for most people. 100-129: near/above optimal. 130-159: borderline high. 160-189: high. 190+: very high. But these numbers alone don't tell the full story. ApoB (which counts the number of atherogenic particles, not just LDL cholesterol content) is gaining traction as a more predictive single marker.",
    impactability: "Takes months to change",
    impactabilityDetail: "Dietary changes (less saturated fat, more fiber) can lower LDL by 5-15% over weeks to months. Statins can lower LDL by 30-50% within 4-6 weeks. Exercise has a modest effect on LDL but improves HDL and other markers. Weight loss helps.",
    impactLevers: ["Statin medication", "Reduce saturated fat", "Increase fiber (especially soluble fiber)", "Weight loss", "Exercise", "Plant sterols"],
    timeToImpact: "Statins: 4-6 weeks. Dietary changes: 2-3 months to see a meaningful shift. Recheck with another lab draw.",
    domains: ["Labs", "Heart health", "Risk"],
    healthTags: ["Cardiovascular disease", "Atherosclerosis", "Stroke risk"],
    usedByScores: [
      { company: "Health plans", score: "CMS Star Ratings (statin therapy measures)" },
      { company: "InsideTracker", score: "InnerAge" },
    ],
    whoSetsLogic: "ACC/AHA guidelines set the treatment thresholds and statin recommendations. The ASCVD Risk Calculator combines LDL with age, blood pressure, diabetes, and smoking to estimate 10-year cardiovascular risk. These guidelines are updated periodically and widely followed.",
    emotionalValence: "Moderate",
    userReaction: "People generally take high cholesterol seriously because of the association with heart attacks. But because cholesterol has no symptoms, motivation to take daily medication for something you can't feel is a persistent challenge. Some people resist statins due to concerns about side effects (muscle aches are the most common). The conversation between patient and doctor about whether to start a statin is one of the most common medical decisions in primary care.",
    dataQuality: "High",
    trustDetail: "Lab-measured LDL is accurate and well-standardized. The main nuance: LDL is typically calculated (using the Friedewald equation) rather than directly measured. In people with very high triglycerides, the calculation becomes less accurate. Direct LDL measurement is available but not routine.",
  },

  {
    id: "creatinine", name: "Creatinine / eGFR (kidney function)",
    whatIsMeasured: "Creatinine is a waste product from normal muscle metabolism. Your kidneys filter it out. If creatinine builds up in your blood, it means your kidneys aren't filtering as well as they should. eGFR (estimated glomerular filtration rate) is calculated from creatinine along with your age and sex to give a more meaningful picture of kidney function.",
    source: "Lab blood draw",
    sourceDetail: "Part of the comprehensive metabolic panel (CMP). Venous blood draw.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a lab visit. Part of routine bloodwork, so it's usually done alongside other tests.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Annually as part of CMP. More frequently for people with kidney disease, diabetes, or on medications that affect the kidneys.",
    cognitiveLoad: "Moderate to hard",
    cognitiveLoadDetail: "The creatinine number (1.2 mg/dL) means little to most people. eGFR is more intuitive (it's a percentage of normal function), but understanding what eGFR 58 means for your life requires clinical context.",
    examples: [
      { value: "eGFR 92", meaning: "Normal kidney function. The kidneys are filtering well. No concern." },
      { value: "eGFR 42", meaning: "Stage 3b chronic kidney disease. The kidneys are working at less than half capacity. This requires monitoring, medication review (some drugs are cleared by the kidneys and need dose adjustment), and aggressive management of blood pressure and diabetes if present." },
    ],
    interpretation: "eGFR above 90: normal. 60-89: mildly decreased (may be normal for age in older adults). 30-59: moderate kidney disease (Stage 3). 15-29: severe (Stage 4). Under 15: kidney failure (Stage 5, may need dialysis). Kidney disease is often called 'silent' because it has no symptoms until advanced stages. Routine screening catches it early.",
    impactability: "Depends on the cause and stage",
    impactabilityDetail: "Early kidney disease is often slowed or stabilized by controlling blood pressure and blood sugar, reducing salt, and adjusting medications. Advanced kidney disease may be irreversible. The key is catching it early through routine bloodwork.",
    impactLevers: ["Blood pressure control", "Blood sugar control", "Reduce salt intake", "Medication review", "Adequate hydration", "Avoid NSAIDs (ibuprofen, naproxen)"],
    timeToImpact: "Kidney function changes slowly. Improvements from blood pressure and glucose control take months to show in eGFR. The goal is often stabilization rather than improvement.",
    domains: ["Labs", "Chronic condition management", "Risk"],
    healthTags: ["Kidney function", "Medication safety", "Diabetes complications", "Hypertension complications"],
    usedByScores: [
      { company: "Health plans", score: "Part of chronic disease quality measures" },
    ],
    whoSetsLogic: "KDIGO (Kidney Disease: Improving Global Outcomes) sets the staging criteria. The eGFR equation has been recently updated (2021) to remove race as a variable, which changed staging for some patients.",
    emotionalValence: "High when abnormal",
    userReaction: "A normal result gets no reaction (most people don't even notice this in their lab results). An abnormal result can be frightening, especially because kidney disease sounds serious and irreversible. The word 'disease' itself carries weight. Clear, honest framing ('your kidneys are working at about 50% capacity; here's what we can do to protect them') matters a lot.",
    dataQuality: "High",
    trustDetail: "Lab creatinine and calculated eGFR are well-validated and standardized. The main nuance: eGFR is less accurate at higher levels of kidney function (it's designed to detect decline, not to precisely measure normal function). Very muscular people may have higher creatinine without kidney problems.",
  },

  {
    id: "vitamin_d", name: "Vitamin D (25-hydroxyvitamin D)",
    whatIsMeasured: "The circulating form of vitamin D in your blood, which reflects how much your body has available. Vitamin D is produced when sunlight hits your skin and is also obtained from food and supplements.",
    source: "Lab blood draw",
    sourceDetail: "Blood draw. Part of expanded wellness panels. Available through direct-to-consumer services as well.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a lab visit. Not always included in basic panels; you may need to request it.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Annually for most people. More often if supplementing and monitoring to find the right dose.",
    cognitiveLoad: "Easy to understand",
    cognitiveLoadDetail: "A number in ng/mL. Higher is better (up to a point). The thresholds are simple.",
    examples: [
      { value: "48 ng/mL", meaning: "Good level. The body has adequate vitamin D for bone health, immune function, and overall well-being." },
      { value: "14 ng/mL", meaning: "Deficient. This person is at risk for weakened bones, impaired immune function, fatigue, and mood issues. Supplementation is clearly indicated. Deficiency this low is very common: an estimated 40%+ of US adults have insufficient vitamin D." },
    ],
    interpretation: "Under 20 ng/mL: deficient. 20-29: insufficient. 30-100: sufficient. Over 100: potentially toxic (very rare, only from excessive supplementation). Most people in northern latitudes, people with darker skin, older adults, and people who spend most time indoors are at risk of deficiency.",
    impactability: "Directly changeable",
    impactabilityDetail: "Supplementation (vitamin D3) reliably raises levels within weeks. Sun exposure also works but is hard to control and carries skin cancer risk. Dietary sources (fatty fish, fortified milk) contribute but rarely provide enough alone.",
    impactLevers: ["Vitamin D3 supplementation (most common: 1,000-5,000 IU daily)", "Moderate sun exposure", "Fatty fish, fortified foods"],
    timeToImpact: "Supplementation raises levels within 4-8 weeks. Recheck with a blood draw to confirm the dose is right.",
    domains: ["Labs", "Longevity"],
    healthTags: ["Bone health", "Immune function", "Mood", "Muscle strength", "Cancer risk"],
    usedByScores: [
      { company: "InsideTracker", score: "InnerAge" },
    ],
    whoSetsLogic: "The Endocrine Society sets clinical thresholds. There's some debate about optimal levels: the Institute of Medicine says 20+ is sufficient; many functional medicine practitioners target 40-60.",
    emotionalValence: "Low",
    userReaction: "Finding out you're vitamin D deficient is usually met with 'huh, I should take a supplement' rather than anxiety. It's one of the least emotionally charged lab results because the fix is simple and the deficiency is so common it doesn't feel like a personal failing.",
    dataQuality: "High",
    trustDetail: "Lab vitamin D measurement is accurate and well-standardized. The main consideration: levels fluctuate seasonally (higher in summer, lower in winter), so a winter reading may be lower than a summer one for the same person.",
  },

  {
    id: "ferritin", name: "Ferritin (iron stores)",
    whatIsMeasured: "A protein that stores iron in your body. The ferritin level reflects how much iron you have in reserve. Low ferritin means your iron stores are depleted, even if your hemoglobin (the acute measure of anemia) is still normal. It's an early warning system.",
    source: "Lab blood draw",
    sourceDetail: "Blood draw. Part of iron panels and expanded wellness panels. Often not included in basic bloodwork unless specifically requested.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a lab visit. Often needs to be specifically requested because it's not part of the standard CMP or CBC.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Annually in expanded panels. More often if treating iron deficiency.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept of iron 'stores' vs. iron in your blood (hemoglobin) isn't intuitive for most people. Understanding that you can be iron-depleted (low ferritin) without being anemic (normal hemoglobin) takes some explaining.",
    examples: [
      { value: "85 ng/mL", meaning: "Healthy iron stores. Plenty of reserve." },
      { value: "12 ng/mL", meaning: "Low. Iron stores are nearly depleted. This person may feel fatigued, have difficulty concentrating, or notice exercise performance declining. If not addressed, it will progress to iron-deficiency anemia. Common in women with heavy periods, vegetarians, and endurance athletes." },
    ],
    interpretation: "Under 15: depleted stores, iron supplementation indicated. 15-30: low, may benefit from supplementation especially if symptomatic. 30-200: normal range. Over 300: elevated, could indicate inflammation, liver disease, or hereditary hemochromatosis. Ferritin is also an acute-phase reactant, meaning it rises during infection or inflammation, which can mask true iron deficiency.",
    impactability: "Directly changeable with supplementation",
    impactabilityDetail: "Iron supplementation (oral or IV) reliably raises ferritin over weeks to months. Dietary iron from red meat, spinach, and fortified foods helps but may not be enough to correct true deficiency. Vitamin C enhances iron absorption.",
    impactLevers: ["Iron supplementation", "Iron-rich foods (red meat, legumes, dark leafy greens)", "Vitamin C with meals (enhances absorption)", "Avoid tea/coffee with iron supplements (inhibits absorption)"],
    timeToImpact: "Oral iron: 4-12 weeks to see ferritin rise. IV iron: faster, often within 1-2 weeks. Symptoms (fatigue, exercise performance) may improve before ferritin normalizes.",
    domains: ["Labs", "Longevity"],
    healthTags: ["Iron deficiency", "Anemia", "Energy", "Athletic performance", "Longevity"],
    usedByScores: [
      { company: "WHOOP", score: "Recommended biomarker for Healthspan" },
      { company: "InsideTracker", score: "InnerAge" },
    ],
    whoSetsLogic: "Hematology guidelines define the thresholds. Longevity-focused physicians often target a higher optimal range (50-150) than traditional medicine (which focuses on preventing frank deficiency).",
    emotionalValence: "Low",
    userReaction: "Similar to vitamin D: the fix is straightforward, and the deficiency is common enough that it doesn't feel alarming. People with chronic fatigue who discover low ferritin often feel relief ('there's a reason I've been so tired, and it's fixable').",
    dataQuality: "High with a caveat",
    trustDetail: "Lab ferritin is accurate. The caveat: ferritin rises during acute inflammation and infection, so a 'normal' ferritin during illness may mask true iron deficiency. If ferritin is tested while you're sick, it should be rechecked when you're well.",
  },

  {
    id: "tsh", name: "TSH (thyroid-stimulating hormone)",
    whatIsMeasured: "A hormone produced by your pituitary gland that tells your thyroid how hard to work. TSH is the primary screening test for thyroid function. When the thyroid is underactive, TSH goes up (the pituitary is shouting louder). When the thyroid is overactive, TSH drops.",
    source: "Lab blood draw",
    sourceDetail: "Blood draw. Often the first and only thyroid test ordered. If abnormal, T3 and T4 are added.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a lab visit. Not always part of routine panels. Many fatigued or overweight people have never had their thyroid checked despite guidelines recommending screening.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Annually if monitored. Often only tested when symptoms (fatigue, weight gain, depression, cold intolerance) prompt investigation.",
    cognitiveLoad: "Hard to understand",
    cognitiveLoadDetail: "The inverse relationship (high TSH = underactive thyroid) is counterintuitive. Most people expect 'high = overactive.' Understanding that TSH is the signal, not the thyroid hormone itself, requires explanation.",
    examples: [
      { value: "2.1 mIU/L", meaning: "Normal. The thyroid is working well. The pituitary doesn't need to ask for more." },
      { value: "8.5 mIU/L", meaning: "Elevated. The pituitary is producing extra TSH because the thyroid isn't making enough hormone. This person likely has hypothyroidism (underactive thyroid). Symptoms may include fatigue, weight gain, depression, cold sensitivity, dry skin, and hair loss. Treatment with levothyroxine is straightforward and effective." },
    ],
    interpretation: "Normal range is roughly 0.4-4.0 mIU/L (varies slightly by lab). Above 4.0: the thyroid may be underactive. Below 0.4: the thyroid may be overactive. Some endocrinologists consider the optimal range narrower (0.5-2.5). Subclinical hypothyroidism (TSH 4-10 with normal T4 and no symptoms) is a gray area where treatment decisions are individualized.",
    impactability: "Treatable with medication",
    impactabilityDetail: "Hypothyroidism is treated with daily levothyroxine (synthetic thyroid hormone). It's one of the most prescribed medications in the world. Dose is adjusted based on follow-up TSH tests every 6-8 weeks until stable. Hyperthyroidism has different treatments (medication, radioactive iodine, or surgery).",
    impactLevers: ["Levothyroxine for hypothyroidism", "Dose adjustment based on follow-up labs", "Consistent medication timing"],
    timeToImpact: "Levothyroxine: symptoms improve in 2-4 weeks. TSH normalizes in 6-8 weeks. Finding the right dose can take several months of adjustments.",
    domains: ["Labs", "Chronic condition management"],
    healthTags: ["Thyroid function", "Energy", "Weight regulation", "Mood", "Metabolism", "Fertility"],
    usedByScores: [
      { company: "InsideTracker", score: "Bloodwork optimization" },
    ],
    whoSetsLogic: "American Thyroid Association sets guidelines. The normal range and treatment thresholds are well-established but have some debate at the margins (particularly for subclinical hypothyroidism).",
    emotionalValence: "Moderate",
    userReaction: "For people who have been struggling with unexplained fatigue, weight gain, or depression, a thyroid diagnosis can be a relief ('there's a reason, and it's treatable'). The chronic nature of the treatment (daily medication, likely for life) can feel daunting. Some people resist the idea of being 'on medication forever,' even though levothyroxine is simply replacing what the body should make on its own.",
    dataQuality: "High",
    trustDetail: "TSH is a well-standardized, highly reliable test. The main consideration: TSH fluctuates throughout the day (highest in early morning) and can be affected by illness, medications (including biotin supplements, which can interfere with the assay), and pregnancy.",
  },

  {
    id: "crp", name: "hs-CRP (high-sensitivity C-reactive protein)",
    whatIsMeasured: "A protein produced by the liver in response to inflammation anywhere in the body. hs-CRP (the high-sensitivity version of the test) can detect low levels of inflammation that the standard CRP test would miss. It's a general alarm bell, not a specific diagnosis.",
    source: "Lab blood draw",
    sourceDetail: "Blood draw. Part of advanced cardiovascular panels and longevity-focused bloodwork. Not always included in standard panels.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a lab visit. Often needs to be specifically requested.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Annually in longevity panels. Not commonly ordered in routine primary care unless assessing cardiovascular risk.",
    cognitiveLoad: "Moderate",
    cognitiveLoadDetail: "The concept of a nonspecific inflammation marker isn't intuitive. 'Your inflammation is elevated' raises more questions than it answers: inflammation from what? The test tells you something is happening but not what.",
    examples: [
      { value: "0.5 mg/L", meaning: "Low. Minimal systemic inflammation. Good cardiovascular sign." },
      { value: "4.2 mg/L", meaning: "Elevated. Something is causing inflammation. Could be cardiovascular risk, an autoimmune condition, chronic infection, obesity, or you might just be getting over a cold. A single elevated reading needs context. If repeated and persistently elevated, it's a signal worth investigating." },
    ],
    interpretation: "Under 1.0 mg/L: low cardiovascular risk. 1.0-3.0: moderate risk. Over 3.0: high risk (or acute inflammation from illness). The American Heart Association and CDC consider hs-CRP useful as an addition to standard lipid screening for cardiovascular risk assessment. It adds information beyond cholesterol alone.",
    impactability: "Indirectly changeable",
    impactabilityDetail: "Reducing systemic inflammation involves weight loss, regular exercise, anti-inflammatory diet (Mediterranean diet), quitting smoking, and managing chronic conditions. Statins also lower hs-CRP. It responds to sustained lifestyle changes over months.",
    impactLevers: ["Regular exercise", "Weight loss", "Anti-inflammatory diet", "Quit smoking", "Adequate sleep", "Statin therapy"],
    timeToImpact: "Months for lifestyle changes. Statins can lower hs-CRP within weeks. A single reading after illness is misleading; recheck when healthy.",
    domains: ["Labs", "Heart health", "Risk", "Longevity"],
    healthTags: ["Cardiovascular risk", "Inflammation", "Autoimmune conditions"],
    usedByScores: [
      { company: "InsideTracker", score: "InnerAge" },
    ],
    whoSetsLogic: "AHA/CDC jointly issued guidelines for hs-CRP use in cardiovascular risk assessment. The thresholds are well-defined.",
    emotionalValence: "Low to moderate",
    userReaction: "The nonspecific nature can cause anxiety ('what's inflamed?'). For health-optimizers, it's one more number to track. For people who've never heard of it, the word 'inflammation' carries a vaguely threatening quality. Clear framing about what it means and doesn't mean is important.",
    dataQuality: "High for trends, noisy for single readings",
    trustDetail: "The lab test is accurate and well-standardized. The challenge is interpretation: hs-CRP is elevated by so many things (recent illness, obesity, autoimmune disease, dental infections) that a single reading is often ambiguous. Two readings 2 weeks apart, both in the same range, is more informative.",
  },

  {
    id: "apob", name: "Apolipoprotein B (ApoB)",
    whatIsMeasured: "A count of all the lipoprotein particles in your blood that can deposit cholesterol in artery walls. Every LDL, VLDL, and Lp(a) particle has exactly one ApoB molecule on its surface, so ApoB gives you a direct count of the total number of atherogenic particles, not just the cholesterol they carry.",
    source: "Lab blood draw",
    sourceDetail: "Blood draw. Part of advanced lipid panels. Increasingly available through direct-to-consumer services. Not yet included in most standard lipid panels.",
    measurementEffort: "Some effort required",
    measurementEffortDetail: "Requires a lab visit. You may need to specifically request it, as many doctors still order only the standard lipid panel.",
    frequencyCapability: "Anytime via blood draw",
    frequencyReality: "Annually in advanced panels. Many people have never had it tested.",
    cognitiveLoad: "Hard to understand",
    cognitiveLoadDetail: "Understanding why particle count matters more than cholesterol content requires a metaphor: it's the number of cars on the highway (ApoB) that causes traffic jams (plaque), not how many passengers (cholesterol) each car is carrying. Most people need this explained.",
    examples: [
      { value: "72 mg/dL", meaning: "Low and healthy. Below the threshold most cardiologists consider optimal (under 90, or under 80 for high-risk patients). Few atherogenic particles in circulation." },
      { value: "142 mg/dL", meaning: "Elevated. A high number of atherogenic particles are circulating and potentially depositing cholesterol in artery walls. This person has meaningful cardiovascular risk even if their standard LDL cholesterol is only borderline. ApoB catches risk that LDL alone can miss." },
    ],
    interpretation: "Under 90 mg/dL: generally considered good. Under 80: optimal for many cardiologists. Under 60: target for high-risk patients. Many lipidologists now consider ApoB the single best predictor of cardiovascular risk. It's particularly useful in cases where LDL and ApoB disagree (called discordance): if ApoB is high but LDL is normal, the person still has elevated risk that standard testing would miss.",
    impactability: "Takes months to change",
    impactabilityDetail: "Same interventions as LDL: statins, dietary changes, weight loss, exercise. Statins are the most effective pharmaceutical intervention.",
    impactLevers: ["Statin medication", "Reduce saturated fat", "Weight loss", "Exercise", "PCSK9 inhibitors (for high-risk patients)"],
    timeToImpact: "Same as LDL: statins take 4-6 weeks, lifestyle changes take 2-3 months.",
    domains: ["Labs", "Heart health", "Risk", "Longevity"],
    healthTags: ["Cardiovascular disease", "Atherosclerosis", "Longevity risk"],
    usedByScores: [
      { company: "InsideTracker", score: "InnerAge" },
      { company: "WHOOP", score: "Recommended biomarker for Healthspan" },
    ],
    whoSetsLogic: "European guidelines have adopted ApoB targets. US guidelines (ACC/AHA) mention ApoB but haven't made it a primary target yet. Longevity-focused cardiologists (like Peter Attia) advocate strongly for ApoB as the primary lipid metric. The clinical consensus is shifting in this direction.",
    emotionalValence: "Low to moderate",
    userReaction: "Most people have never heard of ApoB, so the initial reaction is curiosity or confusion. For people who learn that ApoB catches risk that standard cholesterol testing misses, there can be frustration ('why hasn't my doctor been testing this?'). For health-optimizers, it's become a prestige metric in longevity circles.",
    dataQuality: "High",
    trustDetail: "Lab ApoB measurement is direct, accurate, and well-standardized. Unlike LDL (which is usually calculated), ApoB is directly measured. It's not affected by fasting status, which is a practical advantage.",
  },


];
const DOMAIN_SCORES = [
  {
    id: "sleep_score", name: "Sleep score", category: "Sleep",
    description: "A single 0-100 number summarizing how well you slept. Available on WHOOP, Oura, Apple Watch, Fitbit, Samsung, and Garmin. Each device uses a different algorithm with different weights.",
    inputs: ["Sleep duration vs. need", "Sleep efficiency", "Bed/wake time consistency", "Time in each sleep stage", "Disturbances / wake events"],
    whoMakes: ["WHOOP (adds sleep stress)", "Oura Ring", "Apple Watch", "Fitbit", "Garmin", "Samsung"],
    whatItClaims: "Tells you how restorative your sleep was. A high score means you got enough sleep, stayed asleep, and hit sufficient deep and REM stages.",
    whatItMisses: "Dream quality, subjective feeling of rest, sleep environment, sleep disorders that wearables can't detect. The same night can score 72 on Oura and 88 on Apple Watch because the algorithms weight inputs differently.",
    actionItDrives: "Go to bed earlier, improve consistency, reduce alcohol/caffeine before bed",
    frequency: "Daily",
  },
  {
    id: "recovery", name: "Recovery / Readiness score", category: "Recovery",
    description: "A composite telling you how ready your body is to perform today. Combines overnight physiological data into a single go/caution/stop signal. WHOOP uses red/yellow/green (0-100%), Oura gives a Readiness score, Fitbit has Daily Readiness.",
    inputs: ["HRV (overnight)", "Resting heart rate", "Sleep quality", "Recent strain / activity load", "Respiratory rate"],
    whoMakes: ["WHOOP Recovery (0-100%)", "Oura Readiness", "Fitbit Daily Readiness Score", "Samsung Energy Score"],
    whatItClaims: "Tells you whether to push hard, go moderate, or rest today. Calibrated to your personal baseline.",
    whatItMisses: "Mental readiness, nutrition status, hydration, life stress that doesn't show up in HRV. Proprietary algorithms are black boxes with no independent clinical validation of the composite score itself, though underlying metrics (HRV, RHR) do correlate with validated stress measures.",
    actionItDrives: "Adjust workout intensity, take a rest day, prioritize recovery",
    frequency: "Daily",
  },
  {
    id: "strain_score", name: "Strain score", category: "Activity",
    description: "A 0-21 scale measuring total cardiovascular load across the day. Anything that elevates heart rate contributes. Your Recovery score determines how much strain your body is prepared to handle.",
    inputs: ["Time in heart rate zones", "Duration of elevated HR", "Peak heart rate", "Cumulative cardiovascular demand"],
    whoMakes: ["WHOOP Strain (0-21 scale)"],
    whatItClaims: "Quantifies how hard your body worked today so you can balance strain with recovery over time.",
    whatItMisses: "Muscular strain from lifting (low HR, high mechanical stress), mental/emotional strain, non-cardiovascular fatigue. A hard deadlift session barely moves the score.",
    actionItDrives: "Hit a target strain level, avoid overtraining, balance training load across the week",
    frequency: "Continuous (accumulates throughout the day)",
  },
  {
    id: "body_battery", name: "Body Battery / Energy Score", category: "Recovery",
    description: "A 1-100 energy score that charges during rest and drains during activity and stress. Think of it as a fuel gauge for your body. Three consecutive low morning scores reliably signal accumulated fatigue.",
    inputs: ["HRV", "Stress level", "Activity/strain", "Sleep quality"],
    whoMakes: ["Garmin Body Battery (1-100)", "Samsung Energy Score"],
    whatItClaims: "Shows your available energy in real time so you can plan your day around when you have the most capacity.",
    whatItMisses: "Doesn't account for caffeine, nutrition, or psychological motivation. After very long endurance efforts, it can take unrealistically long to recharge. Alcohol is the most consistent disruptor.",
    actionItDrives: "Schedule demanding activities when score is high, recognize when to rest",
    frequency: "Continuous",
  },
  {
    id: "training_readiness", name: "Training Readiness", category: "Activity",
    description: "A morning-only composite that goes beyond Body Battery to include longer-term training patterns. Synthesizes six inputs into a single readiness assessment designed to guide workout intensity.",
    inputs: ["Body Battery", "Sleep history", "HRV status", "Recovery time", "Training load", "Stress history"],
    whoMakes: ["Garmin Training Readiness"],
    whatItClaims: "A more holistic training guide than Body Battery alone, accounting for cumulative training stress over days and weeks.",
    whatItMisses: "Same limitations as Body Battery plus the opacity of how six inputs are weighted against each other.",
    actionItDrives: "Decide workout intensity for the day, plan deload weeks",
    frequency: "Daily (morning only)",
  },
  {
    id: "activity_rings", name: "Activity Rings", category: "Activity",
    description: "Three daily targets: Move (active calories), Exercise (brisk activity minutes), and Stand (hours with movement). Closing all three rings is the daily goal. Not technically a single score but functions as one through the 'all rings closed' signal.",
    inputs: ["Active calories burned", "Minutes of brisk activity", "Hours with standing/movement"],
    whoMakes: ["Apple Watch"],
    whatItClaims: "A simple, visual daily activity goal system. The gamification drives consistency. Monthly challenges and sharing with friends add social accountability.",
    whatItMisses: "Doesn't account for recovery, overtraining risk, or sleep. You can close all rings on a day your body desperately needs rest. No nuance about quality of movement.",
    actionItDrives: "Move more throughout the day, hit daily minimums, close the rings",
    frequency: "Continuous (three parallel trackers)",
  },
  {
    id: "tir", name: "Time in Range (CGM)", category: "Glucose",
    description: "The percentage of time glucose stays within a target range (typically 70-180 mg/dL for diabetes, tighter for non-diabetics). Updated continuously. Roughly 70% TIR (about 17 hours/day) correlates with an A1C of 7%.",
    inputs: ["Continuous glucose readings (every 1-5 min)", "Target range thresholds", "Time above range", "Time below range"],
    whoMakes: ["Dexcom Clarity", "FreeStyle Libre (LibreView)", "Medtronic Guardian"],
    whatItClaims: "A more actionable glucose metric than A1C because it reveals patterns: post-meal spikes, overnight lows, and the effect of specific foods. Studies show CGM improves glucose primarily through behavioral changes, not medication changes.",
    whatItMisses: "Does not capture the subjective experience of hypoglycemia (feeling terrible at 65 mg/dL even though you're 'close to range'). Interstitial glucose lags blood glucose by 5-20 minutes.",
    actionItDrives: "Adjust diet, meal timing, exercise timing, medication dosing",
    frequency: "Continuous",
  },
  {
    id: "adherence_pdc", name: "Medication adherence (PDC)", category: "Medication",
    description: "Proportion of Days Covered: the percentage of days a patient has medication available based on pharmacy fill data. 80%+ is typically considered adherent. The standard metric used by health plans for quality measurement.",
    inputs: ["Pharmacy fill dates", "Days supply per fill", "Gaps between fills"],
    whoMakes: ["Health plans (for CMS Star Ratings)", "PBMs", "Pharmacy systems"],
    whatItClaims: "A population-level indicator of whether patients are filling prescriptions consistently. Plans with high PDC scores are 3-4x more likely to achieve good clinical outcomes.",
    whatItMisses: "Filling a prescription is not taking a prescription. Does not capture: pill splitting, medication sharing, hoarding, or correct timing of doses. A surrogate marker for actual adherence.",
    actionItDrives: "Refill reminders, 90-day supply programs, pharmacist outreach, prior authorization streamlining",
    frequency: "Monthly (calculated from rolling pharmacy claims data)",
  },
  {
    id: "vo2max", name: "VO2 Max estimate", category: "Fitness",
    description: "Estimated maximal oxygen uptake, the single best measure of cardiorespiratory fitness. Strongly correlated with lower all-cause mortality. Updates slowly (weeks to months of data). One of the nine inputs to WHOOP Healthspan.",
    inputs: ["Heart rate during activity", "Running/walking pace", "Age", "Sex", "Weight"],
    whoMakes: ["Garmin", "Apple Watch", "WHOOP", "Fitbit", "Polar"],
    whatItClaims: "Tells you your cardiovascular fitness level relative to your age and sex. A higher VO2 Max is one of the strongest predictors of living longer.",
    whatItMisses: "Wearable estimates vary significantly from lab values (treadmill + breathing mask). Accuracy depends on doing the right type of activity (usually outdoor running). Not useful for non-runners or people with mobility limitations.",
    actionItDrives: "Increase aerobic training, track fitness improvement over months, set long-term fitness goals",
    frequency: "Weekly (updates gradually with consistent data)",
  },
  {
    id: "a1c_domain", name: "A1C (clinical glucose control)", category: "Glucose",
    description: "A 3-month average blood glucose expressed as a percentage. Under 5.7% is normal. The clinical gold standard for assessing long-term glucose management. Used to make medication decisions.",
    inputs: ["Average blood glucose over 2-3 months (measured via hemoglobin glycation)"],
    whoMakes: ["Clinical labs (Quest, LabCorp)", "Point-of-care devices at doctor offices"],
    whatItClaims: "The definitive measure of whether diabetes treatment is working over time. Drives medication adjustments and risk stratification.",
    whatItMisses: "Hides daily variability. Two patients with A1C of 7.0% can have very different day-to-day patterns: one is stable, the other swings between dangerous highs and lows. This is exactly why Time in Range is gaining traction as a complement.",
    actionItDrives: "Medication adjustment, treatment plan changes, risk counseling",
    frequency: "Quarterly",
  },
  {
    id: "bp_control", name: "Blood pressure control status", category: "Cardiovascular",
    description: "A clinical judgment: is the patient at target? For most adults, that's under 130/80 mmHg. This is a domain score because it turns raw BP readings into a yes/no/borderline assessment.",
    inputs: ["Multiple blood pressure readings over time", "Medication regimen", "Patient history"],
    whoMakes: ["Clinical care teams", "Health plans (for quality measurement)", "Home monitoring systems"],
    whatItClaims: "Tells clinicians and health plans whether hypertension treatment is succeeding.",
    whatItMisses: "Clinical inertia (failure to adjust treatment when BP is elevated) may be a bigger contributor to uncontrolled BP than patient non-adherence. White coat hypertension and masked hypertension complicate the picture.",
    actionItDrives: "Medication adjustment, lifestyle counseling, referral to specialist",
    frequency: "Periodic (assessed at each clinical visit)",
  },
  {
    id: "lipid_assessment", name: "Lipid panel risk assessment", category: "Cardiovascular",
    description: "Moves beyond raw lipid numbers to a risk assessment: given your LDL, HDL, triglycerides, age, and other factors, what is your 10-year cardiovascular risk? Tools like the ASCVD Risk Calculator make the assessment.",
    inputs: ["LDL", "HDL", "Total cholesterol", "Triglycerides", "Age", "Sex", "Blood pressure", "Diabetes status", "Smoking status"],
    whoMakes: ["ACC/AHA ASCVD Risk Calculator", "Clinical care teams", "Cardiology guidelines"],
    whatItClaims: "Converts raw numbers into a personalized risk percentage that guides statin and treatment decisions.",
    whatItMisses: "Population-level risk calculators may not accurately predict individual outcomes. Newer markers (ApoB, Lp(a)) are not included in the standard calculator but may better predict risk in some populations.",
    actionItDrives: "Statin initiation, dietary changes, exercise prescription, follow-up testing",
    frequency: "Annual (recalculated with each new lipid panel)",
  },
];

/* ─── DATA: Composite Scores ─── */
const COMPOSITE_SCORES = [
  {
    id: "whoop_age", name: "WHOOP Age / Pace of Aging", category: "Longevity",
    description: "The most ambitious consumer health rollup. Translates six months of wearable data into a physiological age estimate (WHOOP Age) and a weekly speedometer (Pace of Aging, -1x to 3x) showing whether your habits are accelerating or slowing your aging.",
    inputs: ["VO2 Max", "Resting heart rate", "Sleep consistency", "Total sleep", "Sleep performance", "Daily steps", "Time in HR zones", "Strength activity", "Lean body mass"],
    whoMakes: ["WHOOP (Peak and Life memberships)"],
    whatItClaims: "Connects daily behavioral choices to long-term health outcomes using all-cause mortality research. If your WHOOP Age is lower than your chronological age, your habits are working. Pace of Aging updates weekly as a feedback loop.",
    whatItMisses: "No blood biomarkers, no nutrition data, no medication data, no mental health inputs. Based on epidemiological correlations at the population level. Critics warn users may treat it as an oracle rather than a proxy. The algorithm is proprietary and has not been independently validated.",
    evidenceBase: "Built on peer-reviewed mortality research linking sleep, cardiovascular fitness, and physical activity to longevity. Developed with the Buck Institute for Research on Aging. No published validation study of the composite score itself yet.",
    actionItDrives: "Long-term habit optimization: sleep consistency, daily movement, cardiovascular fitness, strength training",
  },
  {
    id: "dacadoo_health", name: "dacadoo Health Score", category: "Overall wellness",
    description: "A single 1-1000 score covering body, mind, and lifestyle. Displayed as a 'Wheel of Life' with seven sub-areas. Normalized by age and sex for benchmarking. Used by insurers and employers, not individual consumers directly.",
    inputs: ["Physical activity", "Mindfulness", "Sleep", "Nutrition", "Body measurements", "Self-reported health data", "Connected device data"],
    whoMakes: ["dacadoo (B2B platform for insurers and employers)"],
    whatItClaims: "A relative indicator of health that can benchmark individuals against populations. Supports personalized lifestyle recommendations based on score level. Drives engagement in corporate wellness programs.",
    whatItMisses: "Heavy reliance on self-reported data for nutrition and mindfulness. The scoring engine is patented and not transparent. Clinical validation is limited. Primarily designed to drive engagement in insurance/employer programs, not clinical decision-making.",
    evidenceBase: "Patented scoring engine. Some published validation studies but not broadly peer-reviewed.",
    actionItDrives: "Employer wellness program participation, insurance premium adjustments, lifestyle coaching",
  },
  {
    id: "insidetracker_age", name: "InsideTracker InnerAge", category: "Longevity",
    description: "Combines blood biomarkers with fitness data and optionally DNA to estimate biological age vs. chronological age. Requires periodic blood draws. Provides specific food, supplement, and exercise recommendations to improve individual biomarkers.",
    inputs: ["Blood biomarkers (cholesterol, glucose, inflammation, hormones)", "Fitness data (from wearables)", "DNA data (optional)", "Age", "Sex"],
    whoMakes: ["InsideTracker"],
    whatItClaims: "A blood-based biological age estimate that tracks whether interventions are working. Each biomarker gets its own 'optimized zone' based on your demographics, and specific recommendations target out-of-range markers.",
    whatItMisses: "Requires blood draws (friction and cost). The 'optimized zones' are narrower than clinical reference ranges, which may create unnecessary anxiety. The biological age calculation methodology is proprietary.",
    evidenceBase: "Based on published aging biomarker research. The platform uses peer-reviewed reference ranges but the composite InnerAge algorithm is proprietary.",
    actionItDrives: "Targeted nutrition changes, supplement recommendations, exercise adjustments, follow-up blood testing",
  },
  {
    id: "cms_stars", name: "CMS Star Ratings", category: "Population health",
    description: "Health plan-level quality scores (1-5 stars) that include medication adherence alongside clinical outcomes, patient experience, and operational measures. A plan-level composite, not an individual score. Drives billions in Medicare bonus payments.",
    inputs: ["Medication adherence (PDC for diabetes, cholesterol, BP drugs)", "Clinical outcomes (A1C control, BP control)", "Patient experience (CAHPS surveys)", "Complaints and appeals", "Operational metrics"],
    whoMakes: ["Centers for Medicare & Medicaid Services (CMS)"],
    whatItClaims: "A comprehensive quality rating system that helps Medicare beneficiaries choose health plans and incentivizes plans to improve quality through financial bonuses.",
    whatItMisses: "Plan-level score that obscures individual variation. A 4-star plan may have pockets of excellent and poor care. Medication adherence is measured by fills, not actual consumption. Stars incentivize optimizing measurable metrics, which may not align with all aspects of patient well-being.",
    evidenceBase: "Based on decades of quality measurement research. The specific weights and methodology are publicly documented by CMS and updated annually.",
    actionItDrives: "Plan-level quality improvement initiatives, member outreach programs, pharmacist interventions, premium reductions",
  },
  {
    id: "hra_score", name: "Health Risk Assessment (HRA)", category: "Risk prediction",
    description: "A questionnaire-based composite combining demographics, family history, current conditions, and lifestyle factors into a risk profile. Often used at enrollment or annual wellness visits.",
    inputs: ["Age, sex, demographics", "Family health history", "Current conditions and medications", "Lifestyle factors (smoking, exercise, diet, alcohol)", "Biometric data when available (BMI, BP, glucose)"],
    whoMakes: ["Health plans", "Employers", "Wellness platforms (Virgin Pulse, Rally Health)"],
    whatItClaims: "Identifies individuals at elevated risk for chronic conditions. Enables targeted outreach, coaching, and program enrollment. When combined with biometric screening, provides a more complete baseline.",
    whatItMisses: "Limited by self-report accuracy. Point-in-time snapshot that may not reflect current health trajectory. Low completion rates are common (20-40% in many employer programs). Responses may be influenced by social desirability bias.",
    evidenceBase: "Based on established epidemiological risk factor models. Validated at the population level but poor at predicting individual outcomes.",
    actionItDrives: "Risk stratification, targeted coaching enrollment, disease management program referral, benefit design",
  },
];

/* ─── UI Components ─── */

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    fontSize: 12, padding: "5px 14px", borderRadius: 20, border: "1px solid",
    borderColor: active ? "#1D9E75" : "rgba(120,120,110,0.2)",
    background: active ? "rgba(29,158,117,0.1)" : "transparent",
    color: active ? "#0F6E56" : "rgba(60,60,55,0.65)",
    cursor: "pointer", fontWeight: active ? 600 : 400, transition: "all 0.15s",
  }}>{label}</button>
);



/* ─── PAGE: Raw Measurements ─── */

const Section = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{label}</p>
    <div style={{ fontSize: 13, color: "rgba(60,60,55,0.75)", lineHeight: 1.65 }}>{children}</div>
  </div>
);

const RawMeasurementsPage = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    if (!search) return RAW_MEASUREMENTS;
    const q = search.toLowerCase();
    return RAW_MEASUREMENTS.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.whatIsMeasured.toLowerCase().includes(q) ||
      (m.source || "").toLowerCase().includes(q) ||
      (m.domains || []).some(d => d.toLowerCase().includes(q)) ||
      (m.healthTags || []).some(t => t.toLowerCase().includes(q)) ||
      (m.impactability || "").toLowerCase().includes(q) ||
      (m.cognitiveLoad || "").toLowerCase().includes(q) ||
      (m.interpretation || "").toLowerCase().includes(q) ||
      (m.usedByScores || []).some(s => (s.company + " " + s.score).toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Raw measurements</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          Every number you can measure about your body or behavior. These are the building blocks that feed every score above them. Search by name, health area, company, or anything else.
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text" placeholder="Search anything: sleep, glucose, WHOOP, longevity..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 520, padding: "10px 16px", fontSize: 14, borderRadius: 10,
            border: "1px solid rgba(120,120,110,0.2)", outline: "none", background: "rgba(250,249,245,0.6)",
          }}
        />
      </div>
      <p style={{ fontSize: 12, color: "rgba(60,60,55,0.5)", marginBottom: 16 }}>
        {search ? `${filtered.length} results` : `${RAW_MEASUREMENTS.length} measurements`}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map(m => {
          const isOpen = expanded === m.id;
          return (
            <div key={m.id} onClick={() => setExpanded(isOpen ? null : m.id)} style={{
              border: "1px solid", borderColor: isOpen ? "rgba(29,158,117,0.35)" : "rgba(120,120,110,0.12)",
              borderRadius: 10, padding: isOpen ? "14px 18px" : "10px 16px", cursor: "pointer",
              background: isOpen ? "rgba(29,158,117,0.02)" : "transparent",
              transition: "all 0.15s",
            }}>
              {/* Header: always visible (collapsed and expanded) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18", marginBottom: 3 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(60,60,55,0.5)" }}>{m.source}</div>
                  {m.domains && m.domains.length > 0 && (
                    <div style={{ fontSize: 12, color: "rgba(60,60,55,0.45)", marginTop: 2 }}>
                      {m.domains.join(", ")}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 14, color: "rgba(60,60,55,0.25)", flexShrink: 0, marginTop: 2, fontWeight: 300 }}>
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              {/* Expanded: full narrative */}
              {isOpen && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(120,120,110,0.08)" }}>
                  <Section label="What it is">
                    <p style={{ margin: 0 }}>{m.whatIsMeasured}</p>
                    <p style={{ margin: "8px 0 0", fontSize: 12 }}><span style={{ fontWeight: 600, color: "rgba(60,60,55,0.55)" }}>Source:</span> {m.sourceDetail}</p>
                  </Section>

                  <Section label="Getting this number">
                    <p style={{ margin: 0 }}>{m.measurementEffortDetail} {m.frequencyCapability ? `Measured: ${m.frequencyCapability.toLowerCase()}. ` : ""}{m.frequencyReality}</p>
                  </Section>

                  {m.examples && m.examples.length > 0 && (
                    <Section label="What the number looks like">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 10 }}>
                        {m.examples.map((ex, i) => (
                          <div key={i}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", fontVariantNumeric: "tabular-nums" }}>{ex.value}</div>
                            <div style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.55, marginTop: 2 }}>{ex.meaning}</div>
                          </div>
                        ))}
                      </div>
                      {m.interpretation && <p style={{ margin: 0 }}>{m.interpretation}</p>}
                    </Section>
                  )}

                  <Section label="Understanding this number">
                    <p style={{ margin: 0 }}>{m.cognitiveLoadDetail}</p>
                  </Section>

                  <Section label="Changing this number">
                    <p style={{ margin: 0 }}>{m.impactabilityDetail}</p>
                    {m.impactLevers && m.impactLevers.length > 0 && (
                      <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(60,60,55,0.6)" }}>
                        {m.impactLevers.join(", ")}
                      </p>
                    )}
                    {m.timeToImpact && <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(60,60,55,0.5)" }}>{m.timeToImpact}</p>}
                  </Section>

                  <Section label="Typical health categories">
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "rgba(60,60,55,0.7)" }}>
                      {(m.domains || []).join(", ")}
                    </p>
                    {m.healthTags && m.healthTags.length > 0 && (
                      <p style={{ margin: "0 0 10px", fontSize: 12, color: "rgba(60,60,55,0.5)" }}>
                        {m.healthTags.join(", ")}
                      </p>
                    )}
                    {m.usedByScores && m.usedByScores.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 12, color: "rgba(60,60,55,0.5)", marginBottom: 6 }}>Real life examples:</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {m.usedByScores.map((s, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                              <span style={{ fontWeight: 600, color: "rgba(60,60,55,0.6)", minWidth: 70 }}>{s.company}</span>
                              <span style={{ color: "rgba(60,60,55,0.5)" }}>{s.score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {m.whoSetsLogic && <p style={{ margin: 0, fontSize: 12, color: "rgba(60,60,55,0.55)" }}>{m.whoSetsLogic}</p>}
                  </Section>

                  <Section label="What people actually experience">
                    <p style={{ margin: 0 }}>{m.userReaction}</p>
                  </Section>

                  <Section label="How much to trust it">
                    <p style={{ margin: 0 }}>{m.trustDetail}</p>
                  </Section>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ fontSize: 14, color: "rgba(60,60,55,0.4)", padding: 20, textAlign: "center" }}>
            No measurements match "{search}"
          </p>
        )}
      </div>
    </div>
  );
};


/* ─── PAGE: Categories / Segments ─── */
const DOMAIN_DESCRIPTIONS = {
  "Sleep": "Everything related to how you rest: duration, quality, timing, stages, and disruptions. Sleep is the most tracked health category after steps, and the one where wearable data has become most actionable.",
  "Activity": "Movement throughout the day and structured exercise. Steps, distance, duration, intensity, strength training, and sedentary behavior. The category with the clearest dose-response relationship: more is almost always better, up to a point.",
  "Heart health": "Your cardiovascular system: heart rate, blood pressure, heart rhythm, and the fitness of your heart and blood vessels. Many of these metrics are strong predictors of longevity.",
  "Recovery": "How well your body bounces back from stress, exercise, and daily demands. Recovery metrics combine sleep, HRV, and physiological strain into a readiness signal. This is where most wearable product differentiation happens.",
  "Stress": "Both the physiological response (what your body shows) and the psychological experience (what you feel). These don't always match, and the gap between them is itself informative.",
  "Metabolic": "How your body processes energy: blood sugar, insulin function, and metabolic efficiency. The category where continuous monitoring (CGM) has most dramatically changed what's possible.",
  "Nutrition": "What you eat and drink: calories, macronutrients, hydration, and substances like alcohol and caffeine. The hardest category to measure because it relies almost entirely on self-reporting.",
  "Body composition": "What your body is made of: fat, muscle, bone, and water. Goes beyond simple weight to capture the composition that determines metabolic health and physical function.",
  "Medications": "Whether you're taking prescribed treatments as intended, and how they're affecting you. The gap between 'has a prescription' and 'actually takes it correctly' is one of the biggest challenges in healthcare.",
  "Labs": "Blood tests and other clinical measurements done at a lab or doctor's office. The most accurate and clinically validated numbers, but also the least frequent and hardest to act on day to day.",
  "Risk": "Measurements that predict future health problems before they happen. These are the numbers that drive preventive care and early intervention decisions.",
  "Longevity": "Metrics linked by research to how long and how well you live. A growing category as consumer health companies (especially WHOOP and InsideTracker) build products around healthspan.",
  "Chronic condition management": "Ongoing tracking for people living with conditions like diabetes, hypertension, or kidney disease. These measurements guide treatment decisions and catch complications early.",
  "Reproductive health": "Menstrual cycles, fertility, hormonal patterns, and related symptoms. One of the areas where wearable temperature tracking has become clinically meaningful.",
  "Symptoms": "Subjective experiences like pain, mood, energy, and side effects. Hard to measure objectively but essential for understanding the full picture of someone's health.",
  "Cognitive": "Mental performance: memory, focus, emotional processing, and learning. Currently tracked mainly through sleep stages (REM is linked to cognitive function) rather than direct cognitive measurement.",
  "Function / quality of life": "How well you can do the things that matter to you. Pain, energy, mobility, and daily functioning. The outcomes that matter most to patients, even if they're harder to quantify than lab values.",
};

const CategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const categories = useMemo(() => {
    const domainMap = {};
    RAW_MEASUREMENTS.forEach(m => {
      (m.domains || []).forEach(d => {
        if (!domainMap[d]) domainMap[d] = [];
        domainMap[d].push(m);
      });
    });
    return Object.entries(domainMap)
      .map(([name, measurements]) => ({ name, measurements, description: DOMAIN_DESCRIPTIONS[name] || "" }))
      .sort((a, b) => b.measurements.length - a.measurements.length);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.measurements.some(m => m.name.toLowerCase().includes(q))
    );
  }, [search, categories]);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Categories</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          Health measurements group into categories. Each category contains the raw measurements that feed it. Some measurements appear in multiple categories because they connect to more than one area of health. HRV, for example, shows up in Recovery, Stress, Heart health, and Longevity.
        </p>
      </div>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text" placeholder="Search categories or measurements..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 520, padding: "10px 16px", fontSize: 14, borderRadius: 10,
            border: "1px solid rgba(120,120,110,0.2)", outline: "none", background: "rgba(250,249,245,0.6)",
          }}
        />
      </div>
      <p style={{ fontSize: 12, color: "rgba(60,60,55,0.5)", marginBottom: 16 }}>
        {filtered.length} categories
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(c => {
          const isOpen = expanded === c.name;
          return (
            <div key={c.name} onClick={() => setExpanded(isOpen ? null : c.name)} style={{
              border: "1px solid", borderColor: isOpen ? "rgba(55,138,221,0.35)" : "rgba(120,120,110,0.12)",
              borderRadius: 10, padding: isOpen ? "16px 18px" : "12px 16px", cursor: "pointer",
              background: isOpen ? "rgba(55,138,221,0.02)" : "transparent",
              transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a18", marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(60,60,55,0.45)" }}>{c.measurements.length} measurements</div>
                </div>
                <span style={{ fontSize: 14, color: "rgba(60,60,55,0.25)", fontWeight: 300 }}>{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(120,120,110,0.08)" }}>
                  {c.description && (
                    <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.65, margin: "0 0 16px" }}>{c.description}</p>
                  )}
                  <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Measurements in this category</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {c.measurements.map(m => (
                      <div key={m.id} style={{
                        padding: "8px 12px", borderRadius: 8,
                        background: "rgba(120,120,110,0.03)",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", marginBottom: 2 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(60,60,55,0.5)" }}>
                          {m.source}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(60,60,55,0.55)", marginTop: 4, lineHeight: 1.5 }}>
                          {m.whatIsMeasured.length > 150 ? m.whatIsMeasured.slice(0, 150) + "..." : m.whatIsMeasured}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── PAGE: Overall ─── */
const CompositeScoresPage = () => {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Overall scores</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          An overall score takes multiple health categories and compresses them into a single number. Your sleep, activity, heart health, nutrition, and stress become one thing: 74. Or "your body is aging 3 years slower than your chronological age." It is the most ambitious thing you can do with health data, and the most contested.
        </p>
      </div>

      {/* ── What an overall score is trying to do ── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", marginBottom: 12 }}>What an overall score is trying to do</h2>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.65)", lineHeight: 1.7, margin: "0 0 12px" }}>
          The premise is that health is invisible. You can't feel your cholesterol. You can't sense your cardiovascular fitness declining by 2% over a year. You can't see whether your sleep quality is actually improving or you're just getting used to feeling tired. An overall score makes the invisible visible. It takes dozens of data points you'd never look at individually and turns them into a signal you can act on.
        </p>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.65)", lineHeight: 1.7, margin: 0 }}>
          The deeper premise is motivational. A single number creates a game. It goes up or down. You can set a goal. You can compare to your past self. The simplicity is the feature. Nobody wakes up motivated to optimize their heart rate variability, but they might wake up motivated to keep their health score above 80.
        </p>
      </div>

      {/* ── The case for and against ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(29,158,117,0.04)" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#0F6E56", marginBottom: 10 }}>The case for an overall score</p>
          <div style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.65 }}>
            <p style={{ margin: "0 0 8px" }}>Simplicity. One number is less overwhelming than twenty.</p>
            <p style={{ margin: "0 0 8px" }}>Motivation. A score that goes up feels like progress. A score that goes down creates urgency.</p>
            <p style={{ margin: "0 0 8px" }}>Accessibility. People who would never look at HRV or VO2 Max will look at a health score.</p>
            <p style={{ margin: 0 }}>Longitudinal signal. Week-over-week and month-over-month trends in a single number can reveal slow changes that individual metrics miss.</p>
          </div>
        </div>
        <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(216,90,48,0.04)" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#993C1D", marginBottom: 10 }}>The case against</p>
          <div style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.65 }}>
            <p style={{ margin: "0 0 8px" }}>Opacity. When the score drops, you don't know why. The number hides everything that matters.</p>
            <p style={{ margin: "0 0 8px" }}>False precision. A score of 74 implies your health is measurable to that level of specificity. It isn't.</p>
            <p style={{ margin: "0 0 8px" }}>Perverse incentives. People optimize for the score rather than for their actual health. If the algorithm weights sleep heavily, you fixate on sleep and ignore nutrition.</p>
            <p style={{ margin: 0 }}>Emotional risk. A declining score can cause anxiety, shame, or disengagement in people who are already struggling. The people who most need help are the ones most harmed by a bad number.</p>
          </div>
        </div>
      </div>

      {/* ── What separates good from bad ── */}
      <div style={{ marginBottom: 32, padding: "16px 20px", borderRadius: 12, background: "rgba(120,120,110,0.03)", borderLeft: "3px solid rgba(120,120,110,0.15)" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(60,60,55,0.45)", marginBottom: 10 }}>What separates a trustworthy overall score from a questionable one</p>
        <div style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.65 }}>
          <p style={{ margin: "0 0 8px" }}>Transparency about inputs. Can the person see what feeds the score and how it's weighted? Or is it a black box?</p>
          <p style={{ margin: "0 0 8px" }}>Clinical grounding. Is the score built on validated health research, or on a product team's best guess about what matters?</p>
          <p style={{ margin: "0 0 8px" }}>Honest about gaps. Does the score acknowledge when it's working with incomplete data, or does it present a confident number regardless?</p>
          <p style={{ margin: "0 0 8px" }}>Actionable connections. When the score drops, can the person see which category drove the change and what they could do differently?</p>
          <p style={{ margin: 0 }}>Independent validation. Has anyone outside the company that built it tested whether the score actually predicts health outcomes?</p>
        </div>
      </div>

      {/* ── Real-world examples ── */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", marginBottom: 4 }}>Who's doing it today</h2>
        <p style={{ fontSize: 13, color: "rgba(60,60,55,0.5)", marginBottom: 16 }}>Five companies with different approaches to the overall health score. Each encodes a different philosophy about what matters.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMPOSITE_SCORES.map(c => {
          const isOpen = expanded === c.id;
          const appLinks = {
            whoop_age: { label: "WHOOP on the App Store", url: "https://apps.apple.com/us/app/whoop/id933944389" },
            dacadoo_health: { label: "dacadoo website", url: "https://www.dacadoo.com" },
            insidetracker_age: { label: "InsideTracker on the App Store", url: "https://apps.apple.com/us/app/insidetracker/id1468498498" },
            cms_stars: { label: "CMS Star Ratings info", url: "https://www.cms.gov/medicare/health-drug-plans/part-c-d-performance-data" },
            hra_score: { label: "CDC Health Risk Assessments", url: "https://www.cdc.gov/workplacehealthpromotion/model/assessment/index.html" },
          };
          const link = appLinks[c.id];
          return (
            <div key={c.id} onClick={() => setExpanded(isOpen ? null : c.id)} style={{
              border: "1px solid", borderColor: isOpen ? "rgba(83,74,183,0.3)" : "rgba(120,120,110,0.12)",
              borderRadius: 10, padding: isOpen ? "16px 18px" : "12px 16px", cursor: "pointer",
              background: isOpen ? "rgba(83,74,183,0.02)" : "transparent", transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(60,60,55,0.45)" }}>
                    {c.category}
                    {c.whoMakes && c.whoMakes.length > 0 && <span> · {c.whoMakes.join(", ")}</span>}
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "rgba(60,60,55,0.25)", fontWeight: 300 }}>{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(120,120,110,0.08)" }}>
                  <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", lineHeight: 1.65, margin: "0 0 16px" }}>{c.description}</p>

                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Inputs ({c.inputs.length} metrics)</p>
                    <p style={{ fontSize: 13, color: "rgba(60,60,55,0.6)", margin: 0, lineHeight: 1.6 }}>{c.inputs.join(", ")}</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div style={{ padding: 14, borderRadius: 10, background: "rgba(29,158,117,0.04)" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#0F6E56", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>What it claims</p>
                      <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.55 }}>{c.whatItClaims}</p>
                    </div>
                    <div style={{ padding: 14, borderRadius: 10, background: "rgba(216,90,48,0.04)" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#993C1D", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>What it misses</p>
                      <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.55 }}>{c.whatItMisses}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Evidence base</p>
                      <p style={{ fontSize: 13, color: "rgba(60,60,55,0.6)", margin: 0, lineHeight: 1.55 }}>{c.evidenceBase}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Action it drives</p>
                      <p style={{ fontSize: 13, color: "rgba(60,60,55,0.6)", margin: 0, lineHeight: 1.55 }}>{c.actionItDrives}</p>
                    </div>
                  </div>

                  {link && (
                    <div style={{ marginTop: 4 }}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
                        fontSize: 12, color: "#185FA5", textDecoration: "none",
                      }}>{link.label} →</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Related apps ── */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", marginBottom: 12 }}>Related apps and platforms</h2>
        <p style={{ fontSize: 13, color: "rgba(60,60,55,0.5)", marginBottom: 16 }}>These don't all have overall scores, but they are the major platforms where health numbers are tracked and presented. Useful reference for how different companies approach the problem.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "WHOOP", desc: "Recovery, Strain, Sleep Performance, Healthspan (WHOOP Age)", url: "https://apps.apple.com/us/app/whoop/id933944389" },
            { name: "Oura", desc: "Sleep score, Readiness score, Activity score, Cycle Insights", url: "https://apps.apple.com/us/app/oura/id1043837948" },
            { name: "Apple Health", desc: "Health summaries, trends, Activity Rings, Sleep score", url: "https://apps.apple.com/us/app/apple-health/id1242424258" },
            { name: "Fitbit by Google", desc: "Daily Readiness Score, Active Zone Minutes, Sleep score", url: "https://apps.apple.com/us/app/fitbit/id462638897" },
            { name: "Garmin Connect", desc: "Body Battery, Training Readiness, Sleep score, Health Snapshot", url: "https://apps.apple.com/us/app/garmin-connect/id583446403" },
            { name: "Samsung Health", desc: "Energy Score, Sleep score, Body Composition, Stress", url: "https://apps.apple.com/us/app/samsung-health/id1224498774" },
            { name: "InsideTracker", desc: "InnerAge, bloodwork optimization, biomarker tracking", url: "https://apps.apple.com/us/app/insidetracker/id1468498498" },
            { name: "MyFitnessPal", desc: "Calorie and macro tracking, food logging", url: "https://apps.apple.com/us/app/myfitnesspal/id341232718" },
            { name: "Dexcom (CGM)", desc: "Continuous glucose, Time in Range, Clarity reports", url: "https://apps.apple.com/us/app/dexcom-g7/id1637070281" },
            { name: "Medisafe", desc: "Medication reminders, adherence tracking", url: "https://apps.apple.com/us/app/medisafe-pill-med-reminder/id573916946" },
          ].map(app => (
            <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: 8, textDecoration: "none",
              background: "rgba(120,120,110,0.03)", transition: "background 0.15s",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>{app.name}</div>
                <div style={{ fontSize: 12, color: "rgba(60,60,55,0.5)" }}>{app.desc}</div>
              </div>
              <span style={{ fontSize: 12, color: "#185FA5", flexShrink: 0, marginLeft: 12 }}>App Store →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};


/* ─── PAGE: Representation ─── */
const RepresentationPage = () => {
  const [activeExample, setActiveExample] = useState("numeric");

  const examples = {
    numeric: {
      label: "Numeric only",
      cards: [
        { level: "Raw measurement", display: "7h 22m", sublabel: "Total sleep time", context: "The number speaks for itself. Most people intuitively know whether 7 hours is good or bad for them. No interpretation provided by the system." },
        { level: "Category rollup", display: "85", sublabel: "Sleep score", context: "A single number that combines duration, efficiency, consistency, and stage breakdown. The score is clear at a glance, but what went into it and how to improve it is hidden behind the number." },
        { level: "Overall rollup", display: "WHOOP Age: 31", sublabel: "Chronological age: 36", context: "The ultimate compression: your entire health trajectory reduced to one number. Powerful for motivation. But if the number moves in the wrong direction, there's no obvious lever to pull." },
      ],
    },
    narrative: {
      label: "Narrative only",
      cards: [
        { level: "Raw measurement", display: "You slept about an hour less than your body needed last night. You fell asleep quickly, which suggests you were tired, but woke up twice in the second half of the night.", sublabel: "", context: "No number at all. Just a plain-language description of what happened. Accessible and human, but harder to track over time and impossible to chart." },
        { level: "Category rollup", display: "Your sleep has been inconsistent this week. Three of the last five nights were solid, but Tuesday and Thursday were short and restless. The pattern suggests late screen time may be a factor.", sublabel: "", context: "Connects multiple measurements into a story. More useful than a score for understanding what to change, but longer to read and harder to compare week over week." },
        { level: "Overall rollup", display: "Over the past month, your sleep and activity have been strong, but your recovery has been lagging. Your body may be handling more stress than usual. Consider whether work demands or a change in routine is contributing.", sublabel: "", context: "A holistic assessment in words. Captures nuance that a single number cannot. But it's subjective, harder to validate, and different people may interpret the same narrative differently." },
      ],
    },
    both: {
      label: "Numeric and narrative",
      cards: [
        { level: "Raw measurement", display: "7h 22m", sublabel: "Good job. You hit your sleep target tonight. You fell asleep in 11 minutes and got 1h 40m of deep sleep, which is above your recent average.", context: "The number anchors the message. The narrative adds meaning and encouragement. This combination is what most modern health apps are moving toward." },
        { level: "Category rollup", display: "Sleep score: 85", sublabel: "Your best night this week. Deep sleep was strong, and your bedtime was consistent with the last four nights. The one thing holding you back from a higher score: you woke up for about 20 minutes around 3 AM.", context: "The score gives the quick signal (85 = good). The narrative explains why and what to improve. This is the format that research suggests drives the most behavior change: a clear number plus a clear next step." },
        { level: "Overall rollup", display: "WHOOP Age: 31 (5 years younger)", sublabel: "Your pace of aging slowed this week, driven by better sleep consistency and two more strength sessions than last week. The biggest opportunity to improve further: your daily step count has been declining for three weeks.", context: "The number provides the headline. The narrative breaks it down into what worked, what's slipping, and one specific thing to focus on. This is the highest-value representation, and also the hardest to build well." },
      ],
    },
  };

  const active = examples[activeExample];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Numbers & narratives</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          Every health measurement can be shown to a person in three ways: as a number, as a narrative, or as both together. The choice of representation changes what the person understands, how they feel, and what they do next.
        </p>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640, marginTop: 12 }}>
          This applies at every level: raw measurements, category rollups, and overall rollups. A sleep duration of 7h 22m is a number. "You slept well tonight" is a narrative. "7h 22m, nice work, that's your best night this week" is both. Each approach has strengths and trade-offs.
        </p>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(120,120,110,0.15)" }}>
        {Object.entries(examples).map(([key, val]) => (
          <button key={key} onClick={() => setActiveExample(key)} style={{
            flex: 1, padding: "12px 0", cursor: "pointer", fontSize: 13, fontWeight: activeExample === key ? 700 : 400,
            border: "none", borderRight: key !== "both" ? "1px solid rgba(120,120,110,0.15)" : "none",
            background: activeExample === key ? "rgba(55,138,221,0.06)" : "transparent",
            color: activeExample === key ? "#185FA5" : "rgba(60,60,55,0.5)",
            transition: "all 0.2s",
          }}>{val.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {active.cards.map((card, i) => (
          <div key={i} style={{
            border: "1px solid rgba(120,120,110,0.12)", borderRadius: 12, padding: "20px 22px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>{card.level}</div>
            <div style={{
              padding: "16px 20px", borderRadius: 10, background: "rgba(120,120,110,0.03)", marginBottom: 14,
            }}>
              {activeExample === "narrative" ? (
                <p style={{ fontSize: 14, color: "#1a1a18", margin: 0, lineHeight: 1.6 }}>{card.display}</p>
              ) : (
                <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a18", marginBottom: card.sublabel ? 6 : 0, fontVariantNumeric: "tabular-nums" }}>{card.display}</div>
              )}
              {card.sublabel && (
                <p style={{ fontSize: 13, color: "rgba(60,60,55,0.6)", margin: 0, lineHeight: 1.6 }}>{card.sublabel}</p>
              )}
            </div>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.55)", margin: 0, lineHeight: 1.6 }}>{card.context}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: "20px 24px", borderRadius: 12, background: "rgba(120,120,110,0.04)", borderLeft: "3px solid rgba(120,120,110,0.15)" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>The design question</p>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.7)", lineHeight: 1.7, margin: 0 }}>
          Numbers are scannable, comparable, and chartable. Narratives are understandable, personal, and actionable. The best health products figure out when to lead with a number, when to lead with a story, and when to combine them. The answer depends on who's looking, what they're trying to do, and how they're feeling. A person who just got a bad result needs a different representation than a person on a winning streak.
        </p>
      </div>
    </div>
  );
};


/* ─── PAGE: Time & Trends ─── */
const Sparkline = ({ data, color, height = 40, width = 120, showDot = true }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`).join(" ");
  const lastX = (data.length - 1) * stepX;
  const lastY = height - ((data[data.length - 1] - min) / range) * height;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {showDot && <circle cx={lastX} cy={lastY} r="3" fill={color} />}
    </svg>
  );
};

const TimeAndTrendsPage = () => {
  const [timeWindow, setTimeWindow] = useState("day");
  const [referenceFrame, setReferenceFrame] = useState("history");
  const [directionStyle, setDirectionStyle] = useState("chart");

  // ── Section 1: Time windows ──
  const windowData = {
    day: {
      label: "Just today",
      description: "A single glucose spike after lunch. Dramatic in isolation. Most CGM apps default to this view when you first check them.",
      chartData: [95, 100, 105, 112, 145, 178, 182, 168, 145, 125, 110, 105],
      unit: "mg/dL",
      xAxis: "12pm · 1pm · 2pm · 3pm · 4pm",
      annotation: "182 mg/dL after a pasta lunch. Out of range.",
      emotion: "Alarming",
    },
    week: {
      label: "Last 7 days",
      description: "Looking at a week of readings, the lunch spike was the exception. Most days stayed in range. Context reshapes the story.",
      chartData: [110, 115, 108, 132, 182, 118, 112],
      unit: "mg/dL peak",
      xAxis: "Mon · Tue · Wed · Thu · Fri · Sat · Sun",
      annotation: "6 of 7 days under 135. One spike on Friday.",
      emotion: "Mostly fine, one outlier",
    },
    month: {
      label: "Last 30 days",
      description: "Zoom out another level and a trend appears. Weekday glucose has crept up over the month. The Friday spike is part of a pattern, not an outlier.",
      chartData: [112, 115, 118, 116, 122, 125, 128, 130, 132, 135, 138, 142],
      unit: "mg/dL avg",
      xAxis: "Week 1 · Week 2 · Week 3 · Week 4",
      annotation: "Average glucose up 18% this month.",
      emotion: "Concerning pattern",
    },
    year: {
      label: "Last 12 months",
      description: "At this scale, the recent uptick is visible but small against seasonal swings. Holiday season tends to be higher every year for this person.",
      chartData: [125, 128, 122, 118, 115, 118, 120, 125, 128, 135, 145, 142],
      unit: "mg/dL avg",
      xAxis: "Apr · Jun · Aug · Oct · Dec · Feb",
      annotation: "Typical Nov-Feb rise. Returns to baseline by spring.",
      emotion: "Seasonal, not urgent",
    },
  };

  const currentWindow = windowData[timeWindow];
  const maxVal = Math.max(...currentWindow.chartData);
  const minVal = Math.min(...currentWindow.chartData);

  // ── Section 2: Reference frames ──
  const referenceFrames = {
    history: {
      label: "Your own history",
      subtitle: "Compared to your personal baseline",
      value: "68 bpm",
      frame: "Down from 74 bpm three months ago",
      emotion: "Progress you made. Personal and motivating. But if you've declined, the comparison cuts the other way.",
      color: "#0F6E56",
    },
    target: {
      label: "A target",
      subtitle: "Compared to a goal",
      value: "68 bpm",
      frame: "Goal: under 65 bpm. 3 bpm to go.",
      emotion: "Clear direction. Can feel motivating when close to the goal, defeating when far from it. Who set the goal matters.",
      color: "#185FA5",
    },
    peers: {
      label: "Peers",
      subtitle: "Compared to people like you",
      value: "68 bpm",
      frame: "Better than 72% of men your age",
      emotion: "Reassuring when you're ahead, discouraging when you're behind. Can feel competitive or irrelevant depending on the person.",
      color: "#854F0B",
    },
    best: {
      label: "Your personal best",
      subtitle: "Compared to your best ever",
      value: "68 bpm",
      frame: "Personal best: 62 bpm, June 2024",
      emotion: "Aspirational when approaching it, painful when far from it. Older personal bests become harder to beat with age.",
      color: "#A32D2D",
    },
    clinical: {
      label: "Clinical thresholds",
      subtitle: "Compared to medical criteria",
      value: "68 bpm",
      frame: "Normal range: 60-100 bpm",
      emotion: "Clear-cut, but often too coarse to drive behavior. Being 'in normal range' gives no direction to improve.",
      color: "#534AB7",
    },
  };

  const currentFrame = referenceFrames[referenceFrame];

  // ── Section 3: Direction styles ──
  const directionStyles = {
    arrow: {
      label: "Just the direction",
      render: () => (
        <div style={{ padding: "24px", background: "#f8f8f6", borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>Resting heart rate</div>
          <div style={{ fontSize: 60, color: "#0F6E56", lineHeight: 1 }}>↓</div>
          <div style={{ fontSize: 14, color: "#0F6E56", fontWeight: 600, marginTop: 6 }}>Trending down</div>
        </div>
      ),
      pros: "Instant to read. No math required.",
      cons: "Too vague to be actionable. How much down? Over what period? Is it meaningful?",
    },
    number: {
      label: "The change as a number",
      render: () => (
        <div style={{ padding: "24px", background: "#f8f8f6", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>Resting heart rate</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#1a1a18" }}>68</div>
            <div style={{ fontSize: 14, color: "#0F6E56", fontWeight: 600 }}>↓ 6 bpm</div>
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>over last 3 months</div>
        </div>
      ),
      pros: "Specific and meaningful. The person can evaluate whether it's a big or small change.",
      cons: "Requires a moment of interpretation. The context (3 months) needs to be present or the number can mislead.",
    },
    chart: {
      label: "A chart",
      render: () => (
        <div style={{ padding: "20px", background: "#f8f8f6", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>Resting heart rate · 3 months</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a18" }}>68</div>
            <div style={{ fontSize: 12, color: "#0F6E56", fontWeight: 600 }}>bpm</div>
          </div>
          <Sparkline data={[74, 73, 75, 72, 71, 70, 71, 69, 70, 68, 68, 68]} color="#0F6E56" height={50} width={280} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#999", marginTop: 6 }}>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
          </div>
        </div>
      ),
      pros: "Shows both the value and the journey. Reveals patterns (plateaus, reversals) that single numbers hide.",
      cons: "Requires reading and interpretation. Some people ignore charts and just look at the current number.",
    },
    language: {
      label: "Natural language",
      render: () => (
        <div style={{ padding: "24px", background: "#f8f8f6", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>Resting heart rate</div>
          <div style={{ fontSize: 15, color: "#1a1a18", lineHeight: 1.6 }}>
            Your resting heart rate has dropped 6 bpm over the last 3 months. That's a meaningful improvement that usually reflects better cardiovascular fitness.
          </div>
        </div>
      ),
      pros: "Accessible. Explains significance. Good for people who find numbers cold or confusing.",
      cons: "Slower to scan. Longer to generate well. Risks feeling generic or overly enthusiastic.",
    },
  };

  const currentDirection = directionStyles[directionStyle];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Time & trends</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          A number in isolation means less than a number over time. Trends turn data into stories. But they introduce their own set of design decisions: how much history to show, what to compare against, and how to communicate direction. The choices change what people understand and what they do next.
        </p>
      </div>

      {/* ── Time windows ── */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Time windows</h2>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.6)", lineHeight: 1.6, marginBottom: 16, maxWidth: 620 }}>
          The same data at different scales can tell completely different stories. A glucose spike looks alarming at one hour, unremarkable at one week, and a pattern at one month. Which window you show is a design choice with real consequences.
        </p>

        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(120,120,110,0.15)" }}>
          {Object.entries(windowData).map(([key, val], i, arr) => (
            <button key={key} onClick={() => setTimeWindow(key)} style={{
              flex: 1, padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: timeWindow === key ? 700 : 400,
              border: "none", borderRight: i < arr.length - 1 ? "1px solid rgba(120,120,110,0.15)" : "none",
              background: timeWindow === key ? "rgba(55,138,221,0.06)" : "transparent",
              color: timeWindow === key ? "#185FA5" : "rgba(60,60,55,0.5)",
              transition: "all 0.2s",
            }}>{val.label}</button>
          ))}
        </div>

        {/* Chart visual */}
        <div style={{ padding: "20px 24px", border: "1px solid rgba(120,120,110,0.15)", borderRadius: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>Blood glucose</div>
              <div style={{ fontSize: 13, color: "rgba(60,60,55,0.6)", marginTop: 2 }}>{currentWindow.unit}</div>
            </div>
            <div style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: "rgba(55,138,221,0.1)", color: "#185FA5", fontWeight: 600 }}>
              {currentWindow.emotion}
            </div>
          </div>
          <svg width="100%" height="120" viewBox="0 0 600 120" preserveAspectRatio="none" style={{ display: "block", marginBottom: 10 }}>
            {/* Target range background */}
            <rect x="0" y="40" width="600" height="30" fill="rgba(29,158,117,0.06)" />
            {/* Axis */}
            <line x1="0" y1="120" x2="600" y2="120" stroke="#e0e0dd" strokeWidth="1" />
            {/* Data */}
            {(() => {
              const pts = currentWindow.chartData.map((v, i) => {
                const x = (i / (currentWindow.chartData.length - 1)) * 590 + 5;
                const y = 120 - ((v - minVal) / (maxVal - minVal || 1)) * 100 - 10;
                return { x, y, v };
              });
              const pointsStr = pts.map(p => `${p.x},${p.y}`).join(" ");
              return (
                <>
                  <polyline points={pointsStr} fill="none" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="#185FA5" />
                  ))}
                </>
              );
            })()}
          </svg>
          <div style={{ fontSize: 10, color: "#999", textAlign: "center", marginBottom: 10 }}>{currentWindow.xAxis}</div>
          <div style={{ fontSize: 12, color: "rgba(60,60,55,0.65)", fontStyle: "italic", padding: "10px 14px", background: "rgba(120,120,110,0.04)", borderRadius: 8 }}>
            {currentWindow.annotation}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.65, margin: 0, padding: "14px 18px", borderRadius: 10, background: "rgba(120,120,110,0.04)", borderLeft: "3px solid rgba(120,120,110,0.15)" }}>
          {currentWindow.description}
        </p>

        <div style={{ marginTop: 18, padding: "14px 18px", background: "rgba(83,74,183,0.04)", borderLeft: "3px solid rgba(83,74,183,0.25)", borderRadius: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(83,74,183,0.6)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Design question</p>
          <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.6 }}>
            Which window should be the default? Consumer apps often show "today" first because it loads fastest and feels most immediate. But for chronic conditions, the weekly or monthly view is often what the person needs to see. Giving the choice is easy. Choosing a smart default is harder.
          </p>
        </div>
      </div>

      {/* ── Reference frames ── */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Reference frames</h2>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.6)", lineHeight: 1.6, marginBottom: 16, maxWidth: 620 }}>
          A number alone means less than a number relative to something. What you compare against shapes how the person feels about their data. Same number, five different stories.
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {Object.entries(referenceFrames).map(([key, val]) => (
            <button key={key} onClick={() => setReferenceFrame(key)} style={{
              padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12,
              border: "1px solid", borderColor: referenceFrame === key ? val.color + "60" : "rgba(120,120,110,0.2)",
              background: referenceFrame === key ? val.color + "10" : "transparent",
              color: referenceFrame === key ? val.color : "rgba(60,60,55,0.6)",
              fontWeight: referenceFrame === key ? 600 : 400,
            }}>{val.label}</button>
          ))}
        </div>

        <div style={{ padding: "24px 28px", borderRadius: 12, border: `1px solid ${currentFrame.color}30`, background: currentFrame.color + "04", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: currentFrame.color, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>{currentFrame.subtitle}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#1a1a18", letterSpacing: -1 }}>{currentFrame.value}</div>
            <div style={{ fontSize: 14, color: currentFrame.color, fontWeight: 600 }}>{currentFrame.frame}</div>
          </div>
          <div style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.6, fontStyle: "italic" }}>
            {currentFrame.emotion}
          </div>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(83,74,183,0.04)", borderLeft: "3px solid rgba(83,74,183,0.25)", borderRadius: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(83,74,183,0.6)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Design question</p>
          <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.6 }}>
            Most apps pick one frame and stick with it. WHOOP compares to your own recovery baseline. InsideTracker compares to clinical ranges. Strava compares to peers. Which frame you choose shapes whether the product feels like a coach, a doctor, or a competition. And different frames can produce opposite emotional reactions to identical data.
          </p>
        </div>
      </div>

      {/* ── Direction styles ── */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>How to show direction</h2>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.6)", lineHeight: 1.6, marginBottom: 16, maxWidth: 620 }}>
          Once you have a trend, you still have to communicate it. An arrow, a number, a chart, or a sentence. Each has different strengths and fails in different ways.
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {Object.entries(directionStyles).map(([key, val]) => (
            <button key={key} onClick={() => setDirectionStyle(key)} style={{
              padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12,
              border: "1px solid", borderColor: directionStyle === key ? "rgba(29,158,117,0.4)" : "rgba(120,120,110,0.2)",
              background: directionStyle === key ? "rgba(29,158,117,0.08)" : "transparent",
              color: directionStyle === key ? "#0F6E56" : "rgba(60,60,55,0.6)",
              fontWeight: directionStyle === key ? 600 : 400,
            }}>{val.label}</button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          {currentDirection.render()}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(29,158,117,0.04)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#0F6E56", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Strength</p>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.55 }}>{currentDirection.pros}</p>
          </div>
          <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(216,90,48,0.04)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#993C1D", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Trade-off</p>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.55 }}>{currentDirection.cons}</p>
          </div>
        </div>
      </div>

      {/* ── Harder cases ── */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Harder cases</h2>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.6)", lineHeight: 1.6, marginBottom: 18, maxWidth: 620 }}>
          The design patterns above work well when the trend is clear and positive. These are the cases where trends get hard.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(120,120,110,0.12)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Not enough data yet</div>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", margin: 0, lineHeight: 1.6 }}>
              Day one of using an app, there is no trend to show. Most apps hide the trend view until they have enough data, but "enough" is fuzzy. Three days? Two weeks? A month? The empty state matters. "We'll show you trends after 7 days of tracking" sets expectations better than a blank chart.
            </p>
          </div>

          <div style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(120,120,110,0.12)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Flat trends</div>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", margin: 0, lineHeight: 1.6 }}>
              Weight stuck at the same number for 6 weeks. The chart is a flat line. Most apps struggle here because there's no story to tell. The honest move is to say so: "Stable for 6 weeks. Sometimes plateaus come before progress." Pretending a tiny change is meaningful breaks trust.
            </p>
          </div>

          <div style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(120,120,110,0.12)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Reversals</div>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", margin: 0, lineHeight: 1.6 }}>
              Three months of good progress on A1C, then one bad quarter. Do you show the full trend or the recent reversal? The full trend gives hope. The recent reversal gives urgency. The right answer depends on what action you want. Showing both, with honest framing, respects the person.
            </p>
          </div>

          <div style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(120,120,110,0.12)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Noise that looks like signal</div>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", margin: 0, lineHeight: 1.6 }}>
              Daily weight fluctuates 2-4 lbs from water alone. HRV swings wildly night to night. Showing day-to-day changes in noisy metrics generates false alarms and needless anxiety. The better move is to smooth: rolling 7-day averages, trend lines, or hiding daily values until you have enough to calculate a meaningful average.
            </p>
          </div>

          <div style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(120,120,110,0.12)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", marginBottom: 6 }}>Forecasting</div>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", margin: 0, lineHeight: 1.6 }}>
              Some apps project forward: "At this pace, you'll hit your goal in 8 weeks." Motivating when true, damaging when wrong. Forecasts should show uncertainty (a range, not a point), anchor to behavior change (not extrapolation of current trajectory), and degrade gracefully when the person falls off track.
            </p>
          </div>
        </div>
      </div>

      {/* ── Summary ── */}
      <div style={{ padding: "20px 24px", borderRadius: 12, background: "rgba(120,120,110,0.04)", borderLeft: "3px solid rgba(120,120,110,0.15)" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>The core decisions</p>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.7)", lineHeight: 1.7, margin: 0 }}>
          For any number you show, trends add three questions: how far back do we look, what do we compare against, and how do we communicate direction? The answers aren't universal. They depend on who is looking, what they're trying to do, and what emotional state they're in. The hardest cases (plateaus, reversals, noise, sparse data) are where thoughtful design matters most.
        </p>
      </div>
    </div>
  );
};


/* ─── PAGE: Approaches ─── */
const MockFrame = ({ children, label }) => (
  <div style={{ border: "1px solid rgba(120,120,110,0.15)", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
    {label && <div style={{ padding: "6px 12px", background: "rgba(120,120,110,0.04)", fontSize: 10, color: "rgba(60,60,55,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>}
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const MiniMetric = ({ label, value, sub, color }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 11, color: "rgba(60,60,55,0.45)", marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: color || "#1a1a18", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 1 }}>{sub}</div>}
  </div>
);

const APPROACHES = [
  {
    id: "raw_only",
    title: "Raw measurements only",
    description: "Just the numbers with no interpretation. No scores, no colors, no judgment. The person sees 128/82 and decides for themselves whether that's good. This is what a basic home blood pressure cuff does.",
    whenToUse: "When the audience is clinically literate, when transparency matters most, or when you don't have enough confidence in your interpretation to offer one. Also useful when regulatory constraints prevent you from making health claims.",
    risk: "Puts all interpretation burden on the user. Most people don't know what their numbers mean without context.",
    mock: () => (
      <MockFrame label="Morning readings">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <MiniMetric label="Blood pressure" value="128/82" sub="mmHg" />
          <MiniMetric label="Resting heart rate" value="68" sub="bpm" />
          <MiniMetric label="Weight" value="184.2" sub="lbs" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 8 }}>
          <MiniMetric label="Fasting glucose" value="108" sub="mg/dL" />
          <MiniMetric label="Sleep" value="6h 42m" />
          <MiniMetric label="Steps yesterday" value="4,218" />
        </div>
      </MockFrame>
    ),
  },
  {
    id: "categories_only",
    title: "Categories only",
    description: "Scores for each health area, but no overall number. Sleep has a score. Activity has a score. Heart health has a score. Each one stands on its own. The person sees several clear signals without the system trying to collapse them into one.",
    whenToUse: "When different health areas need independent attention and combining them would be misleading. A person can have great sleep and terrible glucose control at the same time. Separate scores respect that reality.",
    risk: "Multiple scores can feel like multiple report cards. Some people find 5 separate numbers more overwhelming than 1.",
    mock: () => (
      <MockFrame label="Your health categories">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { cat: "Sleep", score: 82, color: "#0F6E56" },
            { cat: "Activity", score: 61, color: "#BA7517" },
            { cat: "Heart health", score: 88, color: "#0F6E56" },
            { cat: "Nutrition", score: 45, color: "#A32D2D" },
            { cat: "Stress", score: 70, color: "#854F0B" },
          ].map(c => (
            <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 13, color: "rgba(60,60,55,0.6)", width: 90 }}>{c.cat}</div>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(120,120,110,0.08)" }}>
                <div style={{ width: `${c.score}%`, height: "100%", borderRadius: 4, background: c.color, opacity: 0.6 }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.color, width: 30, textAlign: "right" }}>{c.score}</div>
            </div>
          ))}
        </div>
      </MockFrame>
    ),
  },
  {
    id: "overall_only",
    title: "Overall only",
    description: "One number. That's it. Your health is 74. The ultimate compression. Powerful for simplicity and motivation. But when the number drops, the person has no idea why or what to do about it.",
    whenToUse: "When you want a single rallying signal that drives engagement. When the audience doesn't want details, just a direction. When used as a hook that leads to deeper exploration if the person wants it.",
    risk: "A single number hides everything. Two people with the same score can have completely different health profiles. If the score drops, there's no obvious lever to pull.",
    mock: () => (
      <MockFrame label="Your health">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: "#0F6E56", lineHeight: 1 }}>74</div>
          <div style={{ fontSize: 13, color: "rgba(60,60,55,0.45)", marginTop: 6 }}>out of 100</div>
          <div style={{ fontSize: 12, color: "#0F6E56", marginTop: 8 }}>Trending up this week</div>
        </div>
      </MockFrame>
    ),
  },
  {
    id: "overall_with_categories",
    title: "Overall with categories",
    description: "The headline number plus the breakdown. You see your overall score and what's driving it: sleep is pulling it up, nutrition is dragging it down. The most common pattern in consumer health products today.",
    whenToUse: "When you want both the quick signal and the actionable detail. This is the sweet spot for most health apps. The overall gives the headline; the categories give the levers.",
    risk: "The relationship between category scores and the overall isn't always intuitive. If your sleep score is 90 but your overall is 68, people feel cheated. The weighting logic needs to make sense or be transparent.",
    mock: () => (
      <MockFrame label="Your health">
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#854F0B", lineHeight: 1 }}>68</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 4 }}>Overall</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { cat: "Sleep", score: 84, color: "#0F6E56" },
              { cat: "Activity", score: 72, color: "#0F6E56" },
              { cat: "Heart", score: 81, color: "#0F6E56" },
              { cat: "Nutrition", score: 38, color: "#A32D2D" },
              { cat: "Stress", score: 55, color: "#854F0B" },
            ].map(c => (
              <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", width: 60 }}>{c.cat}</div>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(120,120,110,0.08)" }}>
                  <div style={{ width: `${c.score}%`, height: "100%", borderRadius: 3, background: c.color, opacity: 0.5 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.color, width: 24, textAlign: "right" }}>{c.score}</div>
              </div>
            ))}
          </div>
        </div>
      </MockFrame>
    ),
  },
  {
    id: "overall_adaptive",
    title: "Overall with categories, adaptive to data",
    description: "Same structure as above, but the detail shown for each category depends on how much data is actually available. Rich data gets a full breakdown. Sparse data gets a simpler view with a note about what's missing. Honest about what the system knows and doesn't know.",
    whenToUse: "When your users have uneven data coverage. A person with a wearable and a CGM has rich sleep and glucose data, but their nutrition data might be empty. Showing all categories at equal confidence is misleading.",
    risk: "Visual inconsistency can look broken rather than honest. The 'missing data' state needs to feel intentional, not like an error. Some people will feel bad about the gaps rather than understanding them.",
    mock: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <MockFrame label="No data yet">
          <div style={{ textAlign: "center", padding: "12px 0 16px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(60,60,55,0.2)", lineHeight: 1 }}>--</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.3)", marginTop: 4 }}>Not enough data to calculate a score</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Sleep", "Activity", "Heart health", "Nutrition", "Stress"].map(cat => (
              <div key={cat} style={{ padding: "8px 12px", borderRadius: 8, border: "1px dashed rgba(120,120,110,0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "rgba(60,60,55,0.3)" }}>{cat}</span>
                  <span style={{ fontSize: 11, color: "rgba(60,60,55,0.2)" }}>No data</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Connect a device or start logging to see your health picture</div>
        </MockFrame>

        <MockFrame label="Just enough data (wearable only, no labs, no food logging)">
          <div style={{ textAlign: "center", padding: "8px 0 14px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#854F0B", lineHeight: 1 }}>64</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.35)", marginTop: 4 }}>Partial picture, based on 2 of 5 categories</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Sleep</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#854F0B" }}>61</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>5h 50m total, low efficiency. Based on watch data.</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Activity</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#854F0B" }}>67</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>6,200 steps, 28 active minutes. No strength data.</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, border: "1px dashed rgba(120,120,110,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Heart health</span>
                <span style={{ fontSize: 11, color: "rgba(60,60,55,0.25)" }}>Need 7 days of data</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.25)", marginTop: 2 }}>3 more days of wear time to establish your baseline</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, border: "1px dashed rgba(120,120,110,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Nutrition</span>
                <span style={{ fontSize: 11, color: "rgba(60,60,55,0.25)" }}>No data</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.25)", marginTop: 2 }}>Log meals or connect a nutrition app</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, border: "1px dashed rgba(120,120,110,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Stress</span>
                <span style={{ fontSize: 11, color: "rgba(60,60,55,0.25)" }}>Limited</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.25)", marginTop: 2 }}>HRV-only estimate. Add mood logging for a fuller picture.</div>
            </div>
          </div>
        </MockFrame>

        <MockFrame label="Full data (wearable + CGM + food logging + labs + mood tracking)">
          <div style={{ textAlign: "center", padding: "8px 0 14px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#0F6E56", lineHeight: 1 }}>76</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.35)", marginTop: 4 }}>Complete picture, all 5 categories reporting</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Sleep</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F6E56" }}>84</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>7h 22m, 92% efficiency, consistent timing, 1h 35m deep sleep</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Activity</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#854F0B" }}>62</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>5,800 steps, 22 active zone min, 2 strength sessions this week</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Heart health</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F6E56" }}>81</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>RHR 58, HRV 52ms, BP 122/78, recovery strong</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Nutrition</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#854F0B" }}>58</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>1,950 cal, 95g protein (below target), glucose TIR 74%</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Stress</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F6E56" }}>72</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>HRV stable, mood avg 7/10 this week, 3 meditation sessions</div>
            </div>
          </div>
        </MockFrame>
      </div>
    ),
  },
  {
    id: "categories_with_raw",
    title: "Categories with raw measurements visible",
    description: "Show the category score AND the raw measurements that produced it. The 'show your work' approach. The person sees sleep score 82 and can see exactly why: 7h 22m total, 1h 35m deep sleep, 92% efficiency. Oura does this well.",
    whenToUse: "When trust matters. When your audience wants to verify the score against their own experience. When the raw data itself is useful for decision-making (a runner wants to see both their fitness score and their actual VO2 max).",
    risk: "Information density. Showing category scores plus raw measurements for 5 categories creates a wall of data. Works for data-engaged users; overwhelming for casual ones.",
    mock: () => (
      <MockFrame label="Sleep · Score: 82">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <MiniMetric label="Total sleep" value="7h 22m" />
          <MiniMetric label="Deep sleep" value="1h 35m" />
          <MiniMetric label="REM sleep" value="1h 48m" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <MiniMetric label="Efficiency" value="92%" />
          <MiniMetric label="Time to fall asleep" value="11 min" />
          <MiniMetric label="Times woken" value="2" />
        </div>
        <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, background: "rgba(29,158,117,0.05)", fontSize: 12, color: "#0F6E56" }}>
          Your deep sleep was above your 30-day average. Bedtime was consistent with the last 4 nights.
        </div>
      </MockFrame>
    ),
  },
  {
    id: "exception_based",
    title: "Exception-based (alerts only)",
    description: "Show nothing unless something needs attention. No daily dashboard. No scores. Just a notification when a number crosses a threshold or a pattern changes. The smoke detector model: silent when things are fine, loud when they're not.",
    whenToUse: "For people who don't want to engage with health data daily but do want to be warned when something changes. Good for medication adherence alerts, lab result flags, and screening applications.",
    risk: "No engagement between alerts means no habit-building. The person doesn't learn from daily patterns. And when an alert does fire, it can feel alarming because there's no baseline context.",
    mock: () => (
      <MockFrame label="Health alerts">
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(226,75,74,0.05)", borderLeft: "3px solid #A32D2D", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#A32D2D", marginBottom: 2 }}>Blood pressure elevated</div>
          <div style={{ fontSize: 12, color: "rgba(60,60,55,0.6)", lineHeight: 1.5 }}>Your last 3 home readings averaged 142/88, above your target of 130/80. Consider scheduling a follow-up with your doctor.</div>
        </div>
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(186,117,23,0.05)", borderLeft: "3px solid #854F0B" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#854F0B", marginBottom: 2 }}>Medication refill due</div>
          <div style={{ fontSize: 12, color: "rgba(60,60,55,0.6)", lineHeight: 1.5 }}>Your lisinopril prescription has 3 days of supply remaining. Refill now to avoid a gap.</div>
        </div>
        <div style={{ textAlign: "center", padding: "20px 0 8px", fontSize: 12, color: "rgba(60,60,55,0.3)" }}>No other alerts right now</div>
      </MockFrame>
    ),
  },
  {
    id: "progressive_disclosure",
    title: "Progressive disclosure",
    description: "Start with the simplest view and let the person drill down if they want. The overall score leads to categories, which lead to raw measurements. The full stack is available, but only if you ask for it. Apple Health roughly follows this pattern.",
    whenToUse: "When you have a diverse audience with different levels of data literacy and interest. Casual users see the headline. Power users dig in. Nobody is forced to see more than they want.",
    risk: "The deeper levels may never get seen. If the important insight is buried three taps deep, some users will miss it. The design challenge is surfacing the right thing at the right level.",
    mock: () => (
      <MockFrame label="Your health">
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#0F6E56", lineHeight: 1 }}>78</div>
          <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 4 }}>Tap a category for details</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(120,120,110,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "rgba(60,60,55,0.6)" }}>Sleep</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0F6E56" }}>84 →</span>
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(55,138,221,0.04)", border: "1px solid rgba(55,138,221,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#185FA5" }}>Activity</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#854F0B" }}>58</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)" }}>Steps<br /><span style={{ fontWeight: 600, color: "#1a1a18" }}>4,218</span></div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)" }}>Active min<br /><span style={{ fontWeight: 600, color: "#1a1a18" }}>18</span></div>
              <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)" }}>Exercise<br /><span style={{ fontWeight: 600, color: "#1a1a18" }}>0 sessions</span></div>
            </div>
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(120,120,110,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "rgba(60,60,55,0.6)" }}>Heart health</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0F6E56" }}>81 →</span>
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(120,120,110,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "rgba(60,60,55,0.6)" }}>Nutrition</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#A32D2D" }}>38 →</span>
          </div>
        </div>
      </MockFrame>
    ),
  },
  {
    id: "goal_oriented",
    title: "Goal-oriented",
    description: "Forget categories. Organize around what the person is trying to accomplish. A 'manage my diabetes' view pulls glucose, medication adherence, A1C, activity, and weight into one place, even though those span four different traditional categories. The person's goal is the organizing principle, not the measurement type.",
    whenToUse: "When the person has a clear health goal and the relevant data crosses category boundaries. Chronic condition management, weight loss programs, pregnancy tracking, and athletic training all benefit from this pattern.",
    risk: "You have to know the person's goal, which means asking or inferring. If you guess wrong, the view feels irrelevant. Also, some metrics belong in multiple goals, so you need to handle overlap gracefully.",
    mock: () => (
      <MockFrame label="Your goal: Manage diabetes">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginBottom: 2 }}>Glucose (from CGM)</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F6E56" }}>Time in range: 78%</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.45)" }}>Above your 70% target</div>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginBottom: 2 }}>Medication</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#854F0B" }}>Metformin: taken 5 of last 7 days</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.45)" }}>Missed Saturday and Sunday</div>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginBottom: 2 }}>Activity (from watch)</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F6E56" }}>Post-meal walks: 4 this week</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.45)" }}>Your glucose spikes are 30% smaller on walk days</div>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(120,120,110,0.03)" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginBottom: 2 }}>Last A1C (from lab, 6 weeks ago)</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#854F0B" }}>7.1%</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.45)" }}>Down from 7.8% six months ago. Next test in 6 weeks.</div>
          </div>
        </div>
      </MockFrame>
    ),
  },
  {
    id: "comparative",
    title: "Comparative",
    description: "Whatever you show, show it relative to something: your own past, a clinical target, a population benchmark, or a personal goal. The number alone means less than the number in context. '68 bpm' is just a number. '68 bpm, down from 74 three months ago' is a story.",
    whenToUse: "As a modifier on top of any other approach. Comparison adds meaning to any number. Especially powerful for slow-moving metrics (weight, A1C, VO2 max) where day-to-day changes are invisible but month-over-month trends are significant.",
    risk: "Which comparison you choose shapes the emotional response. Comparing to your own best can feel discouraging if you've declined. Comparing to a population average can feel irrelevant. Comparing to a clinical target can feel clinical and cold. The frame matters as much as the data.",
    mock: () => (
      <MockFrame label="Your trends">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "rgba(60,60,55,0.5)" }}>Resting heart rate</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F6E56" }}>62 bpm</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(60,60,55,0.4)" }}>
              <span>vs. 3 months ago: <span style={{ color: "#0F6E56", fontWeight: 600 }}>68 bpm ↓ good</span></span>
              <span>vs. your age group: <span style={{ fontWeight: 600 }}>better than average</span></span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "rgba(60,60,55,0.5)" }}>A1C</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#854F0B" }}>7.1%</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(60,60,55,0.4)" }}>
              <span>vs. 6 months ago: <span style={{ color: "#0F6E56", fontWeight: 600 }}>7.8% ↓ improving</span></span>
              <span>vs. target: <span style={{ color: "#854F0B", fontWeight: 600 }}>goal is under 7.0%</span></span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "rgba(60,60,55,0.5)" }}>Weight</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a18" }}>184.2 lbs</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(60,60,55,0.4)" }}>
              <span>vs. 3 months ago: <span style={{ fontWeight: 600 }}>184.8 lbs ↓ slight</span></span>
              <span>vs. your goal: <span style={{ color: "#854F0B", fontWeight: 600 }}>target is 175 lbs</span></span>
            </div>
          </div>
        </div>
      </MockFrame>
    ),
  },
  {
    id: "habit_tracker",
    title: "Habit tracker",
    description: "Show the behaviors themselves, day by day. A grid of checkmarks for did-I-or-didn't-I data. The focus is on consistency, not outcomes. This is how most medication, habit, and chronic disease management apps work.",
    whenToUse: "When the action itself is the goal: taking medication, doing physical therapy exercises, logging meals, meditating. When the physiological outcomes are slow or invisible and the person needs a daily signal that they're showing up. Also for accountability-driven users who respond to streaks.",
    risk: "Streaks create pressure. Missing a day can feel like failure, especially when a long streak breaks. Some people give up entirely after one miss because the streak is 'ruined.' For conditions where perfection isn't required, this framing can cause more stress than the behavior is worth.",
    mock: () => (
      <MockFrame label="Your habits this week">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "Morning meds", days: [1, 1, 1, 1, 0, 1, 1], streak: "6 day streak" },
            { name: "Evening meds", days: [1, 1, 0, 1, 1, 1, 1], streak: "4 day streak" },
            { name: "Post-meal walk", days: [1, 0, 1, 1, 1, 0, 1], streak: "2 day streak" },
            { name: "Glucose check", days: [1, 1, 1, 1, 1, 1, 1], streak: "Perfect week" },
          ].map((habit, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{habit.name}</span>
                <span style={{ fontSize: 11, color: "rgba(60,60,55,0.5)" }}>{habit.streak}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, j) => (
                  <div key={j} style={{
                    aspectRatio: "1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 600,
                    background: habit.days[j] ? "rgba(29,158,117,0.15)" : "rgba(226,75,74,0.08)",
                    color: habit.days[j] ? "#0F6E56" : "#A32D2D",
                  }}>{habit.days[j] ? "✓" : "✕"}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, background: "rgba(29,158,117,0.05)", fontSize: 12, color: "#0F6E56" }}>
          26 of 28 habit-days completed this week. Strong consistency.
        </div>
      </MockFrame>
    ),
  },
  {
    id: "value_impact",
    title: "Value and impact",
    description: "Don't show the data. Show what the data means for the person's life. 'You took 28 of 32 doses' becomes 'You likely prevented 6 blood sugar spikes.' 'You walked 45,000 steps' becomes 'That's the equivalent of climbing 3 flights of stairs every day.' Translate measurements into consequences.",
    whenToUse: "When the underlying data is abstract or clinical and the person needs a reason to care. For chronic conditions where the daily benefit is invisible (blood pressure meds don't feel like anything). For motivational contexts where 'you prevented X' is more compelling than 'you did Y.' Pairs well with habit tracking for programs focused on long-term outcomes.",
    risk: "The impact framing requires claims you can stand behind. 'Prevented 6 spikes' needs to be either measured or labeled as an estimate. Overstating the impact can cross into manipulation or set up disappointment. Also, different people find different framings motivating; some want the raw data and feel patronized by translations.",
    mock: () => (
      <MockFrame label="Your impact this month">
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginBottom: 4 }}>You're building a healthier future every day</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(83,74,183,0.05)", borderLeft: "3px solid #534AB7" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginBottom: 2 }}>Meds taken consistently</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18" }}>28 of 32</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#534AB7" }}>88%</span>
            </div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(29,158,117,0.05)", borderLeft: "3px solid #0F6E56" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginBottom: 2 }}>Estimated setbacks prevented</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18" }}>6</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginTop: 2 }}>Great job staying on track</div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(186,117,23,0.05)", borderLeft: "3px solid #BA7517" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginBottom: 2 }}>Time and stress saved</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18" }}>3.5 hours</div>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginTop: 2 }}>Fewer worries, more of your time</div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(55,138,221,0.05)", borderLeft: "3px solid #185FA5" }}>
            <div style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginBottom: 2 }}>Current streak</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18" }}>9 days</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: "rgba(60,60,55,0.35)", fontStyle: "italic" }}>
          *Estimated based on your medication plan and adherence patterns.
        </div>
      </MockFrame>
    ),
  },
];

const ApproachesPage = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Framing choices</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          When you show someone their health, what story are you telling? Just the raw data, a single overall number, or something in the middle? Each framing makes a different trade-off between simplicity and detail, engagement and overwhelm, transparency and usability. These are the main options, from least interpretation to most.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {APPROACHES.map((a, i) => {
          const isOpen = expanded === a.id;
          return (
            <div key={a.id} onClick={() => setExpanded(isOpen ? null : a.id)} style={{
              border: "1px solid", borderColor: isOpen ? "rgba(55,138,221,0.3)" : "rgba(120,120,110,0.12)",
              borderRadius: 10, padding: isOpen ? "16px 18px" : "12px 16px", cursor: "pointer",
              background: isOpen ? "rgba(55,138,221,0.02)" : "transparent",
              transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18", marginBottom: 3 }}>{a.title}</div>
                  {!isOpen && <div style={{ fontSize: 12, color: "rgba(60,60,55,0.45)" }}>{a.description.slice(0, 100)}...</div>}
                </div>
                <span style={{ fontSize: 14, color: "rgba(60,60,55,0.25)", fontWeight: 300 }}>{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", lineHeight: 1.65, margin: "0 0 16px" }}>{a.description}</p>

                  <div style={{ marginBottom: 16 }}>{a.mock()}</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>When to use this</p>
                      <p style={{ fontSize: 12, color: "rgba(60,60,55,0.6)", margin: 0, lineHeight: 1.55 }}>{a.whenToUse}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Watch out for</p>
                      <p style={{ fontSize: 12, color: "rgba(60,60,55,0.6)", margin: 0, lineHeight: 1.55 }}>{a.risk}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


/* ─── PAGE: Decision Helper ─── */
const DECISION_QUESTIONS = [
  { id: "goal", question: "What is the primary goal of scoring in your feature?", options: [
    { label: "Motivate behavior change", value: "motivate", desc: "The person sees the score and it drives a specific action" },
    { label: "Assess current status", value: "assess", desc: "The score tells someone where they stand right now" },
    { label: "Track progress over time", value: "track", desc: "The score shows improvement or decline across weeks/months" },
    { label: "Trigger clinical action", value: "clinical", desc: "The score helps a clinician decide what to do next" },
  ]},
  { id: "audience", question: "Who is the primary audience for this score?", options: [
    { label: "The individual (patient/member)", value: "individual" },
    { label: "A clinician or care team", value: "clinician" },
    { label: "A health plan or employer", value: "plan" },
    { label: "Multiple audiences", value: "multi" },
  ]},
  { id: "data", question: "What kind of data do you have available?", options: [
    { label: "Continuous sensor data (wearable, CGM)", value: "continuous" },
    { label: "Periodic self-reported data (logged by user)", value: "self_report" },
    { label: "Clinical/lab data (from healthcare visits)", value: "clinical_data" },
    { label: "Claims/pharmacy data (administrative)", value: "claims" },
    { label: "A mix of these", value: "mixed" },
  ]},
  { id: "frequency", question: "How often should the score update?", options: [
    { label: "Real-time or daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly or quarterly", value: "monthly" },
    { label: "Depends on the scenario", value: "depends" },
  ]},
];

const RECOMMENDATIONS = {
  motivate: {
    title: "Scores that motivate work best when...",
    points: [
      "The feedback loop is fast (daily or continuous). Slow-updating scores don't drive daily behavior.",
      "The person can see the connection between their action and the score change.",
      "The score has a clear 'good direction' (higher is better, or closer to a target).",
      "The score does NOT punish things outside the person's control.",
    ],
    scoreTypes: ["Domain scores (sleep score, activity rings, Time in Range)", "Consider: is a score even needed, or is the raw number (steps, hours slept) motivating enough on its own?"],
    warning: "Composite scores are risky for motivation. A single overall health score that drops because of one bad night can feel demoralizing and unfair. Domain scores give people a clear target and a clear lever.",
  },
  assess: {
    title: "Assessment scores work best when...",
    points: [
      "There is a clinically validated reference range or benchmark.",
      "The score maps to an established clinical concept (blood pressure control, glucose management).",
      "The audience understands what the score means without extensive education.",
      "The score is transparent about what it includes and excludes.",
    ],
    scoreTypes: ["Domain scores with clinical grounding (A1C, BP control status, adherence PDC)", "Composite scores if validated (CMS Stars, HRA)"],
    warning: "Proprietary black-box scores (WHOOP Recovery, Garmin Body Battery) are useful for personal awareness but risky for clinical assessment because they lack independent validation and transparency.",
  },
  track: {
    title: "Progress tracking scores work best when...",
    points: [
      "The score is sensitive enough to reflect real changes but stable enough to not bounce around randomly.",
      "Trends matter more than any single reading.",
      "The person can see week-over-week or month-over-month direction.",
      "The score is normalized to the individual (personal baseline) rather than a population average.",
    ],
    scoreTypes: ["Domain scores that update frequently (sleep score, recovery, VO2 Max)", "Composite scores that update weekly (WHOOP Age/Pace of Aging)", "Raw measurements with trend lines (weight, resting heart rate)"],
    warning: "The slower a score updates, the harder it is for someone to connect their behavior to the result. A1C (3-month lag) is clinically important but terrible as a motivational feedback loop.",
  },
  clinical: {
    title: "Clinical action scores work best when...",
    points: [
      "The score is based on evidence-based guidelines (ACC/AHA, ADA, CMS).",
      "There is a clear threshold that triggers a specific next step.",
      "The score has been validated in clinical studies.",
      "Sensitivity and specificity are documented (how often does it catch real problems vs. false alarms?).",
    ],
    scoreTypes: ["Domain scores with clinical thresholds (A1C, BP control, lipid risk assessment)", "Composite scores with regulatory backing (CMS Stars)"],
    warning: "Consumer wearable scores (Recovery, Body Battery, Healthspan) are not validated for clinical decision-making. Using them to trigger clinical actions introduces liability risk.",
  },
};

const DecisionHelperPage = () => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  const handleSelect = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    if (step < DECISION_QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    }
  };

  const goalAnswer = answers.goal;
  const rec = goalAnswer ? RECOMMENDATIONS[goalAnswer] : null;
  const allAnswered = Object.keys(answers).length >= DECISION_QUESTIONS.length;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Decision helper</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          Should your feature include a score? And if so, what kind? Walk through these questions to surface the right approach for your product context. This is designed for product teams evaluating whether raw data, domain scores, or composite scores fit their use case.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {DECISION_QUESTIONS.map((q, i) => (
          <div key={q.id} style={{ opacity: i <= step ? 1 : 0.35, transition: "opacity 0.3s", pointerEvents: i <= step ? "auto" : "none" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18", marginBottom: 10 }}>
              <span style={{ color: "rgba(83,74,183,0.5)", marginRight: 8 }}>{i + 1}.</span>{q.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map(opt => (
                <div key={opt.value} onClick={() => handleSelect(q.id, opt.value)} style={{
                  padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                  border: "1px solid", borderColor: answers[q.id] === opt.value ? "rgba(83,74,183,0.4)" : "rgba(120,120,110,0.15)",
                  background: answers[q.id] === opt.value ? "rgba(83,74,183,0.06)" : "transparent",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 14, fontWeight: answers[q.id] === opt.value ? 600 : 400, color: "#1a1a18" }}>{opt.label}</span>
                  {opt.desc && <p style={{ fontSize: 12, color: "rgba(60,60,55,0.55)", margin: "4px 0 0" }}>{opt.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {rec && (
        <div style={{ marginTop: 36, padding: 24, borderRadius: 14, border: "1px solid rgba(83,74,183,0.2)", background: "rgba(83,74,183,0.03)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#534AB7", marginBottom: 12 }}>{rec.title}</h2>
          <div style={{ marginBottom: 16 }}>
            {rec.points.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "#0F6E56", fontWeight: 700, flexShrink: 0 }}>+</span>
                <span style={{ fontSize: 14, color: "rgba(60,60,55,0.8)", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.45)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Recommended score types</p>
            {rec.scoreTypes.map((s, i) => (
              <p key={i} style={{ fontSize: 14, color: "rgba(60,60,55,0.75)", margin: "0 0 4px", lineHeight: 1.5 }}>{s}</p>
            ))}
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: "rgba(216,90,48,0.06)", borderLeft: "3px solid rgba(216,90,48,0.3)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#993C1D", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Watch out</p>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.75)", margin: 0, lineHeight: 1.5 }}>{rec.warning}</p>
          </div>
        </div>
      )}
      {allAnswered && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={() => { setAnswers({}); setStep(0); }} style={{
            padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(120,120,110,0.2)",
            background: "transparent", cursor: "pointer", fontSize: 13, color: "rgba(60,60,55,0.6)",
          }}>Start over</button>
        </div>
      )}
    </div>
  );
};

/* ─── PAGE: Same Person, Different Lens ─── */

/* ─── PAGE: Same Person, Different Lens ─── */


/* ─── PAGE: Same Person, Different Lens ─── */
/* ─── Shared: Storage helpers and SaveButton ─── */
const STORAGE_PREFIX = "saved_v1:";
const SHARED_PREFIX = "shared_v1:";

// localStorage-based storage (replaces artifact's window.storage)
const storage = {
  async set(key, value) {
    try { localStorage.setItem(key, value); return { key, value }; }
    catch (e) { return null; }
  },
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) throw new Error("Not found");
      return { key, value };
    } catch (e) { throw e; }
  },
  async delete(key) {
    try { localStorage.removeItem(key); return { key, deleted: true }; }
    catch (e) { return null; }
  },
  async list(prefix) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    return { keys };
  },
};

const generateId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const formatDate = (ts) => {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const SaveButton = ({ buildCard, onSaved }) => {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    const card = buildCard();
    if (!card) return;
    const finalName = name.trim() || card.auto_name;
    const payload = { ...card, name: finalName, saved_at: Date.now() };
    const id = generateId();
    try {
      await storage.set(`${STORAGE_PREFIX}${id}`, JSON.stringify(payload));
      setSaved(true);
      setEditing(false);
      if (onSaved) onSaved();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  if (saved) {
    return (
      <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(29,158,117,0.1)", color: "#0F6E56", fontSize: 12, fontWeight: 600, display: "inline-block" }}>
        ✓ Saved to library
      </div>
    );
  }

  if (editing) {
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={buildCard()?.auto_name || "Name this card"}
          autoFocus
          onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
          style={{ padding: "6px 10px", fontSize: 12, borderRadius: 6, border: "1px solid rgba(120,120,110,0.25)", outline: "none", minWidth: 220 }} />
        <button onClick={handleSave} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#1D9E75", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
        <button onClick={() => setEditing(false)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(120,120,110,0.2)", background: "transparent", fontSize: 12, color: "rgba(60,60,55,0.5)", cursor: "pointer" }}>Cancel</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={handleSave} style={{
        padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(29,158,117,0.3)",
        background: "rgba(29,158,117,0.06)", color: "#0F6E56", fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}>Save to library</button>
      <button onClick={() => setEditing(true)} style={{
        padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)",
        background: "transparent", color: "rgba(60,60,55,0.5)", fontSize: 12, cursor: "pointer",
      }}>Name & save</button>
    </div>
  );
};

const PersonaLensPage = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [healthContext, setHealthContext] = useState("");
  const [tracking, setTracking] = useState("");
  const [otherDetails, setOtherDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [state, setState] = useState("great");

  const stateConfig = {
    great: { label: "Doing great", color: "#0F6E56", bg: "rgba(29,158,117,0.05)" },
    okay: { label: "Getting by", color: "#854F0B", bg: "rgba(186,117,23,0.05)" },
    bad: { label: "Struggling", color: "#A32D2D", bg: "rgba(226,75,74,0.05)" },
  };

  const buildPersonaDescription = () => {
    const parts = [];
    if (age) parts.push(`${age} years old`);
    if (gender) parts.push(gender);
    if (location) parts.push(`lives in ${location}`);
    if (healthContext) parts.push(healthContext);
    if (tracking) parts.push(`tracks with: ${tracking}`);
    if (otherDetails) parts.push(otherDetails);
    return parts.join(". ") + ".";
  };

  const [loadingState, setLoadingState] = useState("");

  const callApi = async (persona, stateLabel, stateDescription) => {
    const prompt = `You are generating realistic health data for one specific scenario. A product team will use this to understand how health metrics look for a real person.

PERSONA: ${persona}

SCENARIO: This person is "${stateLabel}" - ${stateDescription}

Respond with ONLY valid JSON, no markdown, no backticks, no preamble:

{"persona_summary":"One sentence describing this person","metrics":[{"name":"Metric name","value":"The number","status":"Short phrase","detail":"One sentence of context"}],"narrative":"Two sentences about this person in this state, written for a product team. Include one design insight.","design_question":"One sentence: the key product design question for this state"}

RULES:
- 6-8 metrics, realistic values for this specific persona in this specific state
- Mix of metric types appropriate to the persona (wearable, lab, self-reported, behavioral)
- Plain language, no jargon, as if explaining to a smart non-clinician
- Keep it concise`;

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "API error");
    }

    const text = data.content?.map(i => i.text || "").join("") || "";
    const clean = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(clean);
  };

  const generate = async () => {
    const persona = buildPersonaDescription();
    if (!healthContext && !age) {
      setError("Add at least an age or a health condition to generate.");
      return;
    }
    setLoading(true);
    setError("");
    setState("great");

    const states = {
      great: "Everything is working. Treatment is effective, habits are consistent, numbers are at or near target. This is achievable, not superhuman.",
      okay: "Trying but inconsistent. Some metrics are fine, others are slipping. Not in crisis, but the trajectory needs attention. Real life is getting in the way.",
      bad: "Multiple things are going wrong and reinforcing each other. Show how poor sleep worsens other metrics, which worsens energy, which reduces activity. Address whether showing these numbers helps or overwhelms.",
    };

    try {
      setLoadingState("Generating: doing great...");
      const great = await callApi(persona, "doing great", states.great);

      setLoadingState("Generating: getting by...");
      const okay = await callApi(persona, "getting by", states.okay);

      setLoadingState("Generating: struggling...");
      const bad = await callApi(persona, "struggling", states.bad);

      setResult({
        persona_summary: great.persona_summary || buildPersonaDescription(),
        states: { great, okay, bad },
      });
    } catch (err) {
      console.error("Generation error:", err);
      setError(`Failed to generate: ${err.message}. Try again.`);
    } finally {
      setLoading(false);
      setLoadingState("");
    }
  };

  const reset = () => {
    setResult(null);
    setState("great");
  };

  const sc = stateConfig[state];
  const currentState = result?.states?.[state];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Same person, different lens</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          Describe a person, then see what their health data looks like across three states: doing great, getting by, and struggling. The same metrics tell a very different story at each level. Pay attention to the struggling state and ask: does showing these numbers help, or does it add to the overwhelm?
        </p>
      </div>

      {!result && !loading && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Age</p>
              <input type="number" placeholder="e.g. 55" value={age} onChange={e => setAge(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Gender</p>
              <input type="text" placeholder="e.g. female" value={gender} onChange={e => setGender(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Location</p>
              <input type="text" placeholder="e.g. Phoenix, AZ" value={location} onChange={e => setLocation(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none" }} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Health conditions, goals, or context</p>
            <textarea placeholder="e.g. Type 2 diabetes on metformin, high blood pressure, trying to lose weight.&#10;Or: no conditions, just interested in fitness and longevity.&#10;Or: postpartum, breastfeeding, struggling with sleep deprivation." value={healthContext} onChange={e => setHealthContext(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none", minHeight: 80, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>What they track with (optional)</p>
              <input type="text" placeholder="e.g. Apple Watch, CGM, home BP cuff" value={tracking} onChange={e => setTracking(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Anything else (optional)</p>
              <input type="text" placeholder="e.g. works night shifts, single parent" value={otherDetails} onChange={e => setOtherDetails(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none" }} />
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: "#A32D2D", marginBottom: 16 }}>{error}</p>}

          <button onClick={generate} style={{
            padding: "12px 32px", borderRadius: 10, cursor: "pointer",
            border: "none", fontSize: 14, fontWeight: 600,
            background: "#1D9E75", color: "#fff",
          }}>Generate three states</button>
        </div>
      )}

      {loading && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "rgba(60,60,55,0.5)", marginBottom: 8 }}>{loadingState || "Building three versions of this persona..."}</div>
          <div style={{ fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Three calls, about 10 seconds each</div>
        </div>
      )}

      {result && !loading && (
        <div>
          <div style={{ padding: 14, borderRadius: 10, background: "rgba(120,120,110,0.04)", marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.5 }}>{result.persona_summary || buildPersonaDescription()}</div>
            <button onClick={reset} style={{
              marginTop: 10, padding: "6px 16px", borderRadius: 8, cursor: "pointer",
              border: "1px solid rgba(120,120,110,0.2)", background: "transparent",
              fontSize: 12, color: "rgba(60,60,55,0.5)",
            }}>Change persona</button>
          </div>

          <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(120,120,110,0.15)" }}>
            {["great", "okay", "bad"].map(s => (
              <button key={s} onClick={() => setState(s)} style={{
                flex: 1, padding: "12px 0", cursor: "pointer", fontSize: 13, fontWeight: state === s ? 700 : 400,
                border: "none", borderRight: s !== "bad" ? "1px solid rgba(120,120,110,0.15)" : "none",
                background: state === s ? stateConfig[s].bg : "transparent",
                color: state === s ? stateConfig[s].color : "rgba(60,60,55,0.5)",
                transition: "all 0.2s",
              }}>{stateConfig[s].label}</button>
            ))}
          </div>

          {currentState && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                {(currentState.metrics || []).map((m, i) => (
                  <div key={i} style={{
                    padding: "12px 16px", borderRadius: 8,
                    background: i % 2 === 0 ? "rgba(120,120,110,0.03)" : "transparent",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", marginBottom: 4 }}>{m.name}</div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: sc.color, fontVariantNumeric: "tabular-nums", marginRight: 10 }}>{m.value}</span>
                      <span style={{ fontSize: 12, color: sc.color, fontWeight: 500 }}>{m.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(60,60,55,0.55)", lineHeight: 1.5 }}>{m.detail}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: 20, borderRadius: 12, background: sc.bg, borderLeft: `3px solid ${sc.color}`, marginBottom: 14 }}>
                <p style={{ fontSize: 14, color: "rgba(60,60,55,0.8)", lineHeight: 1.7, margin: 0 }}>{currentState.narrative}</p>
              </div>

              {currentState.design_question && (
                <div style={{ padding: "14px 20px", borderRadius: 10, background: "rgba(83,74,183,0.04)", borderLeft: "3px solid rgba(83,74,183,0.25)" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(83,74,183,0.6)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Design question</p>
                  <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.6 }}>{currentState.design_question}</p>
                </div>
              )}

              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                <SaveButton buildCard={() => ({
                  tool: "persona",
                  tool_label: "Same person, different lens",
                  state_label: stateConfig[state].label,
                  state_color: stateConfig[state].color,
                  topic: result.persona_summary || buildPersonaDescription(),
                  auto_name: `${result.persona_summary?.slice(0, 40) || buildPersonaDescription().slice(0, 40)} · ${stateConfig[state].label}`,
                  inputs: { age, gender, location, healthContext, tracking, otherDetails },
                  data: currentState,
                })} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};


/* ─── PAGE: Coaching Experience Tool ─── */

/* ─── PAGE: Coaching Experience Tool ─── */
const COACHING_TOPICS = [
  { id: "sleep", label: "Sleep improvement" },
  { id: "diabetes", label: "Diabetes management" },
  { id: "weight", label: "Weight management" },
  { id: "heart", label: "Heart health" },
  { id: "stress", label: "Stress management" },
  { id: "medication", label: "Medication adherence" },
  { id: "fitness", label: "Fitness and training" },
  { id: "longevity", label: "Longevity / healthspan" },
];

const CoachingToolPage = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [personaContext, setPersonaContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [state, setState] = useState("good");

  const activeTopic = customTopic || selectedTopic;

  const stateConfig = {
    good: { label: "Good day", color: "#0F6E56", bg: "rgba(29,158,117,0.05)" },
    average: { label: "Average day", color: "#854F0B", bg: "rgba(186,117,23,0.05)" },
    bad: { label: "Bad day", color: "#A32D2D", bg: "rgba(226,75,74,0.05)" },
  };

  const callApi = async (prompt) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "API error");
    const text = data.content?.map(i => i.text || "").join("") || "";
    return JSON.parse(text.replace(/```json\n?|```/g, "").trim());
  };

  const generate = async () => {
    if (!activeTopic) { setError("Pick a topic or type one in."); return; }
    setLoading(true); setError(""); setState("good");

    const ctx = personaContext ? `Person: ${personaContext}.` : "";

    try {
      setLoadingMsg("Identifying measurements...");
      const measData = await callApi(`Topic: "${activeTopic}". ${ctx}
ONLY JSON. 6 measurements for this coaching topic with good/average/bad day values. 3 category scores. 1 overall score.
{"measurements":[{"name":"Name","source":"source","unit":"u","good":"v","average":"v","bad":"v"}],"categories":[{"name":"Cat","good":85,"average":62,"bad":38}],"overall":{"good":82,"average":61,"bad":35}}`);

      setLoadingMsg("Building alerts and goals...");
      const alertData = await callApi(`Topic: "${activeTopic}". ${ctx}
ONLY JSON. Coaching alerts and goals for good/average/bad day. Keep messages under 15 words each.
{"alerts_good":[{"msg":"short positive msg"}],"alerts_avg":[{"msg":"nudge"},{"msg":"nudge"}],"alerts_bad":[{"msg":"concern"},{"msg":"action"}],"goals":[{"name":"Goal","good":"status","average":"status","bad":"status"}]}`);

      setLoadingMsg("Building comparisons...");
      const compData = await callApi(`Topic: "${activeTopic}". ${ctx}
ONLY JSON. 3 comparison metrics and short coaching narratives for good/average/bad day. Narratives under 25 words each.
{"comparisons":[{"name":"Metric","current_good":"v","current_avg":"v","current_bad":"v","week_ago":"v","target":"v"}],"coaching_good":"Short warm coaching","coaching_avg":"Short encouraging coaching","coaching_bad":"Short supportive coaching"}`);

      setResult({ ...measData, ...alertData, ...compData, topic: activeTopic });
    } catch (err) {
      console.error(err);
      setError(`Failed to generate: ${err.message}. Try again.`);
    } finally { setLoading(false); setLoadingMsg(""); }
  };

  const reset = () => { setResult(null); setState("good"); };

  const sc = stateConfig[state];
  const s = state;

  // ── Approach renderers ──
  // ── Phone frame wrapper ──
  const PhoneFrame = ({ children, appName, accent = "#1a1a18" }) => (
    <div style={{
      maxWidth: 340, margin: "0 auto",
      borderRadius: 32, border: "6px solid #1a1a1a",
      background: "#fff", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    }}>
      {/* Status bar */}
      <div style={{ padding: "10px 20px 6px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 600, color: "#1a1a18" }}>
        <span>9:41</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10 }}>●●●●</span>
          <span style={{ fontSize: 9 }}>100%</span>
        </span>
      </div>
      {/* App header */}
      {appName && (
        <div style={{ padding: "4px 20px 10px", background: "#fff", borderBottom: "1px solid rgba(120,120,110,0.08)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: 0.3 }}>{appName}</div>
        </div>
      )}
      {children}
    </div>
  );

  // ── Section with title and optional save button ──
  const ApproachSection = ({ title, desc, saveCardData, children }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 12, color: "rgba(60,60,55,0.5)", lineHeight: 1.5 }}>{desc}</div>
        </div>
        {saveCardData && (
          <div style={{ flexShrink: 0 }}>
            <SaveButton buildCard={() => saveCardData} />
          </div>
        )}
      </div>
      {children}
    </div>
  );

  const renderApproaches = () => {
    if (!result) return null;
    const m = result.measurements || [];
    const cats = result.categories || [];
    const ov = result.overall || {};
    const alerts = s === "good" ? result.alerts_good : s === "average" ? result.alerts_avg : result.alerts_bad;
    const goals = result.goals || [];
    const comps = result.comparisons || [];
    const narrative = s === "good" ? result.coaching_good : s === "average" ? result.coaching_avg : result.coaching_bad;
    const ovScore = ov[s] || 0;
    const ovColor = ovScore >= 70 ? "#0F6E56" : ovScore >= 50 ? "#854F0B" : "#A32D2D";
    const stateLabelText = stateConfig[s].label;

    const baseCardData = (approachName) => ({
      tool: "coaching",
      tool_label: "Coaching topic options",
      state_label: stateLabelText,
      state_color: sc.color,
      topic: result.topic,
      auto_name: `${result.topic} · ${approachName} · ${stateLabelText}`,
      inputs: { topic: result.topic, personaContext, approach: approachName },
      data: result,
      current_state: s,
      approach: approachName,
    });

    const dayLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ─────────────── 1. Raw measurements only ─────────────── */}
        <ApproachSection
          title="1. Raw measurements only"
          desc="Just the numbers. Like a clinical portal. No interpretation, no color. The person decides what matters."
          saveCardData={baseCardData("Raw measurements only")}
        >
          <PhoneFrame appName="VITALS" accent="#444">
            <div style={{ padding: "16px 20px", background: "#fff" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{dayLabel}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a18", marginBottom: 16 }}>Today's readings</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {m.slice(0, 6).map((met, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0", borderBottom: i < 5 ? "1px solid #f0f0ee" : "none" }}>
                    <span style={{ fontSize: 13, color: "#555" }}>{met.name}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a18", fontVariantNumeric: "tabular-nums" }}>
                      {met[s]} <span style={{ fontSize: 11, color: "#999", fontWeight: 400 }}>{met.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 2. Categories only ─────────────── */}
        <ApproachSection
          title="2. Categories only"
          desc="Scores for each health area. Like Oura's three scores layout but without an overall number."
          saveCardData={baseCardData("Categories only")}
        >
          <PhoneFrame appName="HEALTH PULSE" accent="#185FA5">
            <div style={{ padding: "18px 20px", background: "linear-gradient(180deg, #f8f9fb 0%, #fff 100%)" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{dayLabel}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18", marginBottom: 18, letterSpacing: -0.3 }}>Your day</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cats.map((c, i) => {
                  const val = c[s];
                  const col = val >= 70 ? "#0F6E56" : val >= 50 ? "#854F0B" : "#A32D2D";
                  return (
                    <div key={i} style={{ padding: "14px 16px", borderRadius: 14, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f0f0ee" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>{c.name}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: col, fontVariantNumeric: "tabular-nums" }}>{val}</div>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: "#f0f0ee", overflow: "hidden" }}>
                        <div style={{ width: `${val}%`, height: "100%", background: col, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 3. Overall only ─────────────── */}
        <ApproachSection
          title="3. Overall only"
          desc="One big ring. Like Garmin's Body Battery screen or a simplified Apple Watch ring. Nothing else."
          saveCardData={baseCardData("Overall only")}
        >
          <PhoneFrame appName="SCORE" accent={ovColor}>
            <div style={{ padding: "40px 20px 50px", background: "#fff", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>{dayLabel}</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 30 }}>Your health today</div>

              {/* Ring */}
              <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 24px" }}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="78" fill="none" stroke="#f0f0ee" strokeWidth="12" />
                  <circle cx="90" cy="90" r="78" fill="none" stroke={ovColor} strokeWidth="12"
                    strokeDasharray={`${(ovScore / 100) * 490} 490`} strokeLinecap="round"
                    transform="rotate(-90 90 90)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 52, fontWeight: 800, color: ovColor, lineHeight: 1, letterSpacing: -2 }}>{ovScore}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>out of 100</div>
                </div>
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, color: ovColor }}>
                {ovScore >= 70 ? "Looking great" : ovScore >= 50 ? "Holding steady" : "Needs attention"}
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 4. Overall with categories ─────────────── */}
        <ApproachSection
          title="4. Overall with categories"
          desc="The WHOOP or dacadoo pattern. A hero score at the top, with the categories driving it underneath."
          saveCardData={baseCardData("Overall with categories")}
        >
          <PhoneFrame appName="DAILY" accent="#534AB7">
            <div style={{ padding: "20px 20px 24px", background: "linear-gradient(180deg, #f5f4fc 0%, #fff 40%)" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{dayLabel}</div>

              {/* Hero */}
              <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Overall</div>
                <div style={{ fontSize: 60, fontWeight: 800, color: ovColor, lineHeight: 1, letterSpacing: -2 }}>{ovScore}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{ovScore >= 70 ? "↑ Strong day" : ovScore >= 50 ? "→ Average" : "↓ Below baseline"}</div>
              </div>

              {/* Categories */}
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#f0f0ee", borderRadius: 12, overflow: "hidden" }}>
                {cats.map((c, i) => {
                  const val = c[s];
                  const col = val >= 70 ? "#0F6E56" : val >= 50 ? "#854F0B" : "#A32D2D";
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#fff" }}>
                      <div style={{ fontSize: 13, color: "#1a1a18" }}>{c.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 60, height: 4, borderRadius: 2, background: "#f0f0ee" }}>
                          <div style={{ width: `${val}%`, height: "100%", background: col, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: col, minWidth: 24, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{val}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 5. Overall adaptive ─────────────── */}
        <ApproachSection
          title="5. Overall with categories, adaptive to data"
          desc="Same pattern as above, but honest about what data is and isn't there. Missing categories show clearly."
          saveCardData={baseCardData("Overall adaptive")}
        >
          <PhoneFrame appName="DAILY" accent="#534AB7">
            <div style={{ padding: "20px 20px 24px", background: "#fff" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{dayLabel}</div>

              <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Overall</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: ovColor, lineHeight: 1, letterSpacing: -1.5 }}>{ovScore}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>Based on {cats.length} of {cats.length + 1} categories</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cats.map((c, i) => {
                  const val = c[s];
                  const col = val >= 70 ? "#0F6E56" : val >= 50 ? "#854F0B" : "#A32D2D";
                  return (
                    <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "#f8f8f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 13, color: "#1a1a18" }}>{c.name}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: col, fontVariantNumeric: "tabular-nums" }}>{val}</div>
                    </div>
                  );
                })}
                <div style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px dashed #d0d0cc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>Lab results</div>
                    <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>No recent data. Add your last blood work →</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#bbb" }}>—</div>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 6. Categories with raw ─────────────── */}
        <ApproachSection
          title="6. Categories with raw measurements visible"
          desc="The 'show your work' pattern. Category score at the top, individual metrics underneath. Like Oura's sleep detail screen."
          saveCardData={baseCardData("Categories with raw")}
        >
          <PhoneFrame appName="DETAIL" accent={sc.color}>
            <div style={{ background: "#fff" }}>
              {cats.length > 0 && (() => {
                const cat = cats[0];
                const val = cat[s];
                const col = val >= 70 ? "#0F6E56" : val >= 50 ? "#854F0B" : "#A32D2D";
                return (
                  <>
                    {/* Top section with score */}
                    <div style={{ padding: "24px 20px 20px", background: col + "0c", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{cat.name}</div>
                      <div style={{ fontSize: 56, fontWeight: 800, color: col, lineHeight: 1, letterSpacing: -2 }}>{val}</div>
                      <div style={{ fontSize: 12, color: col, marginTop: 6, fontWeight: 600 }}>
                        {val >= 70 ? "Strong" : val >= 50 ? "Fair" : "Needs work"}
                      </div>
                    </div>
                    {/* Metrics breakdown */}
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>Contributors</div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {m.slice(0, 5).map((met, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: i < 4 ? "1px solid #f0f0ee" : "none" }}>
                            <div>
                              <div style={{ fontSize: 13, color: "#1a1a18" }}>{met.name}</div>
                              <div style={{ fontSize: 10, color: "#999", marginTop: 1 }}>{met.source}</div>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", fontVariantNumeric: "tabular-nums" }}>
                              {met[s]} <span style={{ fontSize: 11, color: "#999", fontWeight: 400 }}>{met.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 7. Exception-based ─────────────── */}
        <ApproachSection
          title="7. Exception-based (alerts only)"
          desc="Silent when things are fine, loud when they're not. The smoke detector model. Like CareKit notifications."
          saveCardData={baseCardData("Exception-based alerts")}
        >
          <PhoneFrame appName="ALERTS" accent={sc.color}>
            <div style={{ padding: "20px 20px 24px", background: "#fff" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{dayLabel}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18", marginBottom: 18, letterSpacing: -0.3 }}>
                {s === "good" ? "All clear" : s === "average" ? "Heads up" : "Attention needed"}
              </div>

              {alerts && alerts.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {alerts.map((a, i) => (
                    <div key={i} style={{
                      padding: "14px 16px", borderRadius: 12,
                      background: s === "good" ? "#f0faf6" : s === "average" ? "#fdf8ef" : "#fdf1f1",
                      border: `1px solid ${sc.color}22`,
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                        background: sc.color + "18", color: sc.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700,
                      }}>{s === "good" ? "✓" : s === "average" ? "!" : "!"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "#1a1a18", lineHeight: 1.5 }}>{a.msg}</div>
                        <div style={{ fontSize: 10, color: "#999", marginTop: 6 }}>{i === 0 ? "Just now" : i === 1 ? "15 min ago" : "1 hour ago"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "40px 0", textAlign: "center", fontSize: 13, color: "#aaa" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                  Everything's on track
                </div>
              )}
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 8. Progressive disclosure ─────────────── */}
        <ApproachSection
          title="8. Progressive disclosure"
          desc="Headline first, tap any category to drill down. The Apple Health model. Respects both casual and data-hungry users."
          saveCardData={baseCardData("Progressive disclosure")}
        >
          <PhoneFrame appName="HEALTH" accent="#E5554D">
            <div style={{ padding: "18px 20px 24px", background: "#f5f5f3", minHeight: 400 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a18", marginBottom: 16, letterSpacing: -0.5 }}>Summary</div>

              {/* Hero tile */}
              <div style={{ padding: "18px 18px", borderRadius: 16, background: "#fff", marginBottom: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Today</div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: ovColor, lineHeight: 1 }}>{ovScore}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>Tap to see details →</div>
                </div>
              </div>

              {/* Category tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {cats.slice(0, 4).map((c, i) => {
                  const val = c[s];
                  const col = val >= 70 ? "#0F6E56" : val >= 50 ? "#854F0B" : "#A32D2D";
                  const isExpanded = i === 0;
                  return (
                    <div key={i} style={{
                      padding: "12px 14px", borderRadius: 12, background: "#fff",
                      gridColumn: isExpanded ? "1 / span 2" : "auto",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      border: isExpanded ? `1.5px solid ${col}` : "none",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: isExpanded ? 10 : 0 }}>
                        <div style={{ fontSize: 11, color: "#666", fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: col, fontVariantNumeric: "tabular-nums" }}>{val}</div>
                      </div>
                      {isExpanded && (
                        <div style={{ borderTop: "1px solid #f0f0ee", paddingTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                          {m.slice(0, 3).map((met, j) => (
                            <div key={j}>
                              <div style={{ fontSize: 9, color: "#999" }}>{met.name}</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", marginTop: 2 }}>{met[s]}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 9. Goal-oriented ─────────────── */}
        <ApproachSection
          title="9. Goal-oriented"
          desc="Organized around what the person is trying to do. Pulls from across categories into one view. Like Livongo or Omada."
          saveCardData={baseCardData("Goal-oriented")}
        >
          <PhoneFrame appName="PROGRAM" accent="#0F6E56">
            <div style={{ background: "#fff" }}>
              {/* Goal header */}
              <div style={{ padding: "20px 20px 16px", background: "linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Your program</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>{result.topic}</div>
                {narrative && (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>{narrative}</div>
                )}
              </div>

              {/* Goals */}
              <div style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>This week</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {goals.map((g, i) => (
                    <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "#f8f8f6", borderLeft: `3px solid ${sc.color}` }}>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>{g.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", lineHeight: 1.4 }}>{g[s]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

        {/* ─────────────── 10. Comparative ─────────────── */}
        <ApproachSection
          title="10. Comparative"
          desc="Every number shown with context. Relative to your own history and your targets. Like InsideTracker reports."
          saveCardData={baseCardData("Comparative")}
        >
          <PhoneFrame appName="TRENDS" accent="#185FA5">
            <div style={{ padding: "18px 20px", background: "#fff" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{dayLabel}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a18", marginBottom: 18, letterSpacing: -0.3 }}>Your trends</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {comps.map((c, i) => {
                  const current = s === "good" ? c.current_good : s === "average" ? c.current_avg : c.current_bad;
                  return (
                    <div key={i} style={{ padding: "14px 16px", borderRadius: 12, background: "#f8f8f6" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: sc.color, fontVariantNumeric: "tabular-nums" }}>{current}</div>
                      </div>
                      <div style={{ display: "flex", gap: 12, borderTop: "1px solid #e8e8e6", paddingTop: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: "#999", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>Last week</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginTop: 2 }}>{c.week_ago}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: "#999", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>Target</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginTop: 2 }}>{c.target}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PhoneFrame>
        </ApproachSection>

      </div>
    );
  };


  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Coaching topic options</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          Pick a health coaching topic and see what the experience could look like. The same set of measurements looks very different depending on how you present the data. Toggle between a good day, an average day, and a bad day to see how each approach handles different states.
        </p>
      </div>

      {/* ── Topic Selection ── */}
      {!result && !loading && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Pick a coaching topic</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {COACHING_TOPICS.map(t => (
                <button key={t.id} onClick={() => { setSelectedTopic(t.label); setCustomTopic(""); }} style={{
                  padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                  border: "1px solid", borderColor: selectedTopic === t.label && !customTopic ? "rgba(29,158,117,0.4)" : "rgba(120,120,110,0.2)",
                  background: selectedTopic === t.label && !customTopic ? "rgba(29,158,117,0.08)" : "transparent",
                  color: selectedTopic === t.label && !customTopic ? "#0F6E56" : "rgba(60,60,55,0.6)",
                  fontWeight: selectedTopic === t.label && !customTopic ? 600 : 400,
                }}>{t.label}</button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "rgba(60,60,55,0.4)", marginBottom: 6 }}>Or type your own:</p>
            <input type="text" placeholder="e.g. postpartum recovery, managing COPD, marathon training" value={customTopic}
              onChange={e => { setCustomTopic(e.target.value); if (e.target.value) setSelectedTopic(""); }}
              style={{ width: "100%", maxWidth: 480, padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>About the person (optional)</p>
            <input type="text" placeholder="e.g. 55-year-old woman, on metformin, uses Apple Watch" value={personaContext}
              onChange={e => setPersonaContext(e.target.value)}
              style={{ width: "100%", maxWidth: 480, padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid rgba(120,120,110,0.2)", outline: "none" }} />
          </div>

          {error && <p style={{ fontSize: 13, color: "#A32D2D", marginBottom: 16 }}>{error}</p>}

          <button onClick={generate} style={{
            padding: "12px 32px", borderRadius: 10, cursor: "pointer", border: "none", fontSize: 14, fontWeight: 600,
            background: activeTopic ? "#1D9E75" : "rgba(120,120,110,0.15)",
            color: activeTopic ? "#fff" : "rgba(60,60,55,0.3)",
          }}>Generate coaching views</button>
        </div>
      )}

      {loading && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "rgba(60,60,55,0.5)", marginBottom: 8 }}>{loadingMsg}</div>
          <div style={{ fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Three calls, about 10 seconds each</div>
        </div>
      )}

      {result && !loading && (
        <div>
          {/* Topic + reset */}
          <div style={{ padding: 14, borderRadius: 10, background: "rgba(120,120,110,0.04)", marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18" }}>Coaching on: {result.topic}</div>
            {personaContext && <div style={{ fontSize: 12, color: "rgba(60,60,55,0.5)", marginTop: 4 }}>{personaContext}</div>}
            <button onClick={reset} style={{
              marginTop: 10, padding: "6px 16px", borderRadius: 8, cursor: "pointer",
              border: "1px solid rgba(120,120,110,0.2)", background: "transparent", fontSize: 12, color: "rgba(60,60,55,0.5)",
            }}>Change topic</button>
          </div>

          {/* Raw measurements list */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Measurements that could be included</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(result.measurements || []).map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 6, background: i % 2 === 0 ? "rgba(120,120,110,0.03)" : "transparent" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginLeft: 8 }}>{m.source}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)" }}>{m.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* State toggle */}
          <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(120,120,110,0.15)" }}>
            {["good", "average", "bad"].map(st => (
              <button key={st} onClick={() => setState(st)} style={{
                flex: 1, padding: "12px 0", cursor: "pointer", fontSize: 13, fontWeight: state === st ? 700 : 400,
                border: "none", borderRight: st !== "bad" ? "1px solid rgba(120,120,110,0.15)" : "none",
                background: state === st ? stateConfig[st].bg : "transparent",
                color: state === st ? stateConfig[st].color : "rgba(60,60,55,0.5)",
                transition: "all 0.2s",
              }}>{stateConfig[st].label}</button>
            ))}
          </div>

          {/* 10 approaches */}
          {renderApproaches()}
        </div>
      )}
    </div>
  );
};



/* ─── PAGE: Library ─── */
const CardPreview = ({ card, condensed = false }) => {
  const data = card.data || {};
  const metrics = data.metrics || data.measurements || [];
  const narrative = data.narrative || data.coaching_good || data.coaching_avg || data.coaching_bad;

  if (condensed) {
    return (
      <div>
        {metrics.slice(0, 3).map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11 }}>
            <span style={{ color: "rgba(60,60,55,0.5)" }}>{m.name}</span>
            <span style={{ fontWeight: 600, color: "#1a1a18", fontVariantNumeric: "tabular-nums" }}>
              {m.value || m[card.current_state] || m.good || "—"}
            </span>
          </div>
        ))}
        {metrics.length > 3 && (
          <div style={{ fontSize: 10, color: "rgba(60,60,55,0.3)", marginTop: 4 }}>+ {metrics.length - 3} more</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(120,120,110,0.03)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{m.name}</div>
            <div style={{ fontSize: 13, color: card.state_color, fontWeight: 600 }}>
              {m.value || m[card.current_state] || m.good || "—"}
              {m.status && <span style={{ fontSize: 11, color: "rgba(60,60,55,0.5)", marginLeft: 8, fontWeight: 400 }}>{m.status}</span>}
            </div>
            {m.detail && <div style={{ fontSize: 11, color: "rgba(60,60,55,0.55)", marginTop: 3, lineHeight: 1.5 }}>{m.detail}</div>}
          </div>
        ))}
      </div>
      {narrative && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(120,120,110,0.04)", fontSize: 12, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, borderLeft: `3px solid ${card.state_color}` }}>
          {narrative}
        </div>
      )}
    </div>
  );
};


/* ─── PAGE: Case Study - Medication Adherence ─── */
const MedAdherenceCaseStudy = () => {
  const [philosophy, setPhilosophy] = useState("score");
  const [level, setLevel] = useState("measurement");

  const philosophies = {
    score: { label: "Score-focused", color: "#0F6E56", desc: "Lead with numbers. Clean, quantitative, data-forward. The WHOOP / Oura philosophy: give people a precise score and let the number motivate them." },
    behavior: { label: "Behavior-focused", color: "#534AB7", desc: "Lead with patterns and insights. What's working, what's not, and why. The coaching philosophy: help people understand their own behavior before telling them what to change." },
    action: { label: "Action-focused", color: "#185FA5", desc: "Lead with what to do next. Goals, plans, recommendations. The program philosophy: don't just show the problem, show the path forward." },
  };

  const levels = {
    measurement: { label: "Individual measurements", desc: "The raw data: each dose, each day, each timing." },
    category: { label: "Category score", desc: "Medication adherence as a single category score with components." },
    overall: { label: "Overall health score", desc: "Adherence as one input to a broader health picture." },
  };

  const p = philosophies[philosophy];
  const l = levels[level];

  // ── Phone frame (reused from coaching tool) ──
  const Frame = ({ appName, accent, children }) => (
    <div style={{
      maxWidth: 340, margin: "0 auto",
      borderRadius: 32, border: "6px solid #1a1a1a",
      background: "#fff", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    }}>
      <div style={{ padding: "10px 20px 6px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 600, color: "#1a1a18" }}>
        <span>9:41</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10 }}>●●●●</span>
          <span style={{ fontSize: 9 }}>100%</span>
        </span>
      </div>
      {appName && (
        <div style={{ padding: "4px 20px 10px", background: "#fff", borderBottom: "1px solid rgba(120,120,110,0.08)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: accent || "#444", letterSpacing: 0.3 }}>{appName}</div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );

  // ═══════════════════════════════════════════
  // SCORE-FOCUSED MOCKUPS
  // ═══════════════════════════════════════════

  const scoreMeasurement = () => (
    <Frame appName="MY MEDS" accent="#0F6E56">
      <div style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a18", marginBottom: 4 }}>Today's doses</div>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>3 of 4 taken</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { name: "Metformin 500mg", time: "7:48 AM", target: "7:00-9:00 AM", status: "on-time" },
            { name: "Lisinopril 10mg", time: "8:02 AM", target: "7:00-9:00 AM", status: "on-time" },
            { name: "Atorvastatin 20mg", time: "9:15 PM", target: "8:00-10:00 PM", status: "on-time" },
            { name: "Metformin 500mg", time: "—", target: "6:00-8:00 PM", status: "missed" },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid #f0f0ee" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>{d.name}</div>
                <div style={{ fontSize: 10, color: "#999" }}>Window: {d.target}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.status === "on-time" ? "#0F6E56" : "#A32D2D", fontVariantNumeric: "tabular-nums" }}>{d.time}</div>
                <div style={{ fontSize: 10, color: d.status === "on-time" ? "#0F6E56" : "#A32D2D" }}>
                  {d.status === "on-time" ? "✓ On time" : "✕ Missed"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "#f8f8f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Today's completion</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#854F0B" }}>75%</span>
        </div>
      </div>
    </Frame>
  );

  const scoreCategory = () => (
    <Frame appName="ADHERENCE SCORE" accent="#0F6E56">
      <div style={{ padding: "20px 20px 24px" }}>
        {/* Ring */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto" }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="65" fill="none" stroke="#f0f0ee" strokeWidth="10" />
              <circle cx="75" cy="75" r="65" fill="none" stroke="#0F6E56" strokeWidth="10"
                strokeDasharray={`${(87 / 100) * 408} 408`} strokeLinecap="round"
                transform="rotate(-90 75 75)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#0F6E56", lineHeight: 1, letterSpacing: -1 }}>87</div>
              <div style={{ fontSize: 10, color: "#0F6E56", fontWeight: 600, marginTop: 2 }}>Great job!</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Past 30 days · You took 87% of prescribed doses</div>
        </div>

        {/* Components */}
        <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>Score breakdown</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#f0f0ee", borderRadius: 10, overflow: "hidden" }}>
          {[
            { name: "Taking your meds", score: 90, note: "Great consistency!" },
            { name: "Timing", score: 78, note: "Room to improve" },
            { name: "Consistency", score: 82, note: "Good habits forming" },
            { name: "Refill & access", score: 70, note: "Keep it up" },
            { name: "Engagement", score: 88, note: "Excellent!" },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#fff" }}>
              <div>
                <div style={{ fontSize: 12, color: "#1a1a18" }}>{c.name}</div>
                <div style={{ fontSize: 10, color: c.score >= 80 ? "#0F6E56" : "#854F0B" }}>{c.note}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.score >= 80 ? "#0F6E56" : "#854F0B", fontVariantNumeric: "tabular-nums" }}>{c.score}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
          {[{ range: "0-49", label: "Needs work" }, { range: "50-79", label: "Getting there" }, { range: "80-100", label: "On track" }].map((b, i) => (
            <div key={i} style={{ flex: 1, fontSize: 9, color: "#999", textAlign: "center", padding: "6px 0", borderRadius: 6, background: "#f8f8f6" }}>
              <div style={{ fontWeight: 600 }}>{b.range}</div>
              <div>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );

  const scoreOverall = () => (
    <Frame appName="HEALTH SCORE" accent="#0F6E56">
      <div style={{ padding: "20px 20px 24px" }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Good morning, Alex</div>

        {/* Hero ring */}
        <div style={{ textAlign: "center", margin: "16px 0 20px" }}>
          <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#f0f0ee" strokeWidth="10" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="#0F6E56" strokeWidth="10"
                strokeDasharray={`${(78 / 100) * 377} 377`} strokeLinecap="round"
                transform="rotate(-90 70 70)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#0F6E56", lineHeight: 1, letterSpacing: -1 }}>78</div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Overall</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#0F6E56", marginTop: 6, fontWeight: 600 }}>↑ 10 pts vs last 7 days</div>
        </div>

        {/* Categories including adherence */}
        <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>What's driving your score</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#f0f0ee", borderRadius: 10, overflow: "hidden" }}>
          {[
            { name: "Medication adherence", score: 87, highlight: true },
            { name: "Activity", score: 72 },
            { name: "Sleep", score: 68 },
            { name: "Nutrition", score: 81 },
            { name: "Heart health", score: 82 },
          ].map((c, i) => {
            const col = c.score >= 80 ? "#0F6E56" : c.score >= 60 ? "#854F0B" : "#A32D2D";
            return (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", background: c.highlight ? "#f0faf6" : "#fff",
                borderLeft: c.highlight ? "3px solid #0F6E56" : "3px solid transparent",
              }}>
                <div style={{ fontSize: 12, color: "#1a1a18", fontWeight: c.highlight ? 600 : 400 }}>{c.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 40, height: 4, borderRadius: 2, background: "#f0f0ee" }}>
                    <div style={{ width: `${c.score}%`, height: "100%", background: col, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: col, minWidth: 24, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{c.score}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "#f8f8f6", fontSize: 12, color: "#555", lineHeight: 1.5 }}>
          Your medication adherence is your strongest category this month. It's pulling your overall score up.
        </div>
      </div>
    </Frame>
  );

  // ═══════════════════════════════════════════
  // BEHAVIOR-FOCUSED MOCKUPS
  // ═══════════════════════════════════════════

  const behaviorMeasurement = () => (
    <Frame appName="INSIGHTS" accent="#534AB7">
      <div style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a18", marginBottom: 2 }}>Morning timing</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: "rgba(83,74,183,0.1)", color: "#534AB7", fontWeight: 600 }}>This week</span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: "transparent", color: "#999", border: "1px solid #e0e0dd" }}>All time</span>
        </div>

        {/* Score with context */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f0ee" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#534AB7" strokeWidth="6"
                strokeDasharray={`${(72 / 100) * 214} 214`} strokeLinecap="round"
                transform="rotate(-90 40 40)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#534AB7" }}>72%</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#1a1a18" }}>5 of 7 days on track</div>
            <div style={{ fontSize: 12, color: "#A32D2D", fontWeight: 600 }}>↓ 6 pts vs last week</div>
          </div>
        </div>

        {/* Daily breakdown */}
        <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>Daily breakdown</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 16 }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
            const hit = [1, 1, 0, 1, 1, 0, 1][i];
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#999", marginBottom: 4 }}>{d}</div>
                <div style={{
                  width: 28, height: 28, borderRadius: 14, margin: "0 auto",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: hit ? "rgba(29,158,117,0.15)" : "rgba(226,75,74,0.1)",
                  color: hit ? "#0F6E56" : "#A32D2D",
                  fontSize: 12, fontWeight: 700,
                }}>{hit ? "✓" : "✕"}</div>
              </div>
            );
          })}
        </div>

        {/* What's happening */}
        <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>What's getting in the way?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { reason: "Rushed morning", count: "2x" },
            { reason: "Forgot", count: "1x" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "#f8f8f6" }}>
              <span style={{ fontSize: 12, color: "#555" }}>{r.reason}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#534AB7" }}>{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );

  const behaviorCategory = () => (
    <Frame appName="BEHAVIORAL INSIGHTS" accent="#534AB7">
      <div style={{ padding: "18px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#999", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Behavioral insight score</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: "#534AB7", lineHeight: 1 }}>74</div>
          <div style={{ fontSize: 11, color: "#534AB7", fontWeight: 600, marginTop: 4 }}>Good progress</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>You're building healthy habits. Keep going!</div>
        </div>

        {/* What's helping */}
        <div style={{ fontSize: 10, color: "#0F6E56", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>What's helping</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {[
            { insight: "Evening follow-through", detail: "You take evening meds 90% consistently" },
            { insight: "Streak momentum", detail: "12 days in a row and counting" },
          ].map((h, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(29,158,117,0.05)", borderLeft: "3px solid #0F6E56" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{h.insight}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{h.detail}</div>
            </div>
          ))}
        </div>

        {/* What to watch */}
        <div style={{ fontSize: 10, color: "#854F0B", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>What to watch</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { insight: "Mornings are your challenge", detail: "82% of missed doses happen before 9 AM" },
            { insight: "Weekdays are harder", detail: "40% less consistent Mon-Fri vs. weekends" },
          ].map((w, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(186,117,23,0.05)", borderLeft: "3px solid #854F0B" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{w.insight}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{w.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );

  const behaviorOverall = () => (
    <Frame appName="YOUR HEALTH COACH" accent="#534AB7">
      <div style={{ background: "#fff" }}>
        {/* Coach avatar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0ee", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: "linear-gradient(135deg, #534AB7, #7B6FE0)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>M</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>Maya, your coach</div>
            <div style={{ fontSize: 10, color: "#0F6E56" }}>● Online now</div>
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {/* Chat-style insight */}
          <div style={{ padding: "12px 14px", borderRadius: "12px 12px 12px 4px", background: "#f5f4fc", marginBottom: 12, maxWidth: "90%" }}>
            <div style={{ fontSize: 12, color: "#1a1a18", lineHeight: 1.6 }}>
              Hi Alex! Your medication adherence dropped to 68% this week, down from 87% last week. Mornings have been the hardest. Let's figure out what changed.
            </div>
            <div style={{ fontSize: 9, color: "#999", marginTop: 6 }}>9:41 AM</div>
          </div>

          {/* Inline data card */}
          <div style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #e8e8e6", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#534AB7", marginBottom: 6 }}>What I'm seeing</div>
            {[
              { pattern: "Timing is your biggest challenge", detail: "82% of missed doses are in the morning" },
              { pattern: "Better in the evenings", detail: "90% consistent with evening doses" },
            ].map((p, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: i === 0 ? "1px solid #f0f0ee" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{p.pattern}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{p.detail}</div>
                </div>
                <span style={{ fontSize: 14, color: "#ddd" }}>›</span>
              </div>
            ))}
          </div>

          {/* Explore options */}
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(83,74,183,0.04)", border: "1px solid rgba(83,74,183,0.12)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#534AB7", marginBottom: 6 }}>What might be playing a role?</div>
            {["My morning routine is unpredictable", "I feel fine, so I skip sometimes", "Side effects or how I feel", "It's hard to remember"].map((o, i) => (
              <div key={i} style={{ padding: "8px 10px", marginTop: 4, borderRadius: 8, background: "#fff", border: "1px solid #e8e8e6", fontSize: 12, color: "#555" }}>{o}</div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );

  // ═══════════════════════════════════════════
  // ACTION-FOCUSED MOCKUPS
  // ═══════════════════════════════════════════

  const actionMeasurement = () => (
    <Frame appName="MY PLAN TRACKER" accent="#185FA5">
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a18" }}>May 12 - May 18</div>
        </div>

        {/* Day grid header */}
        <div style={{ display: "grid", gridTemplateColumns: "130px repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
          <div />
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} style={{ fontSize: 9, color: "#999", textAlign: "center", fontWeight: 600 }}>{d}</div>
          ))}
        </div>

        {/* Habit rows */}
        {[
          { name: "Morning meds", sub: "7:00-9:00 AM", days: [1, 1, 0, 1, 1, 0, 1] },
          { name: "Weekday routine", sub: "Before work", days: [1, 1, 0, 1, 1, null, null] },
          { name: "Evening meds", sub: "8:00-10:00 PM", days: [1, 1, 1, 1, 1, 1, 1] },
          { name: "Weekly check-in", sub: "With Maya", days: [null, null, null, null, null, null, null] },
        ].map((h, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "130px repeat(7, 1fr)", gap: 2, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8f8f6" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a18" }}>{h.name}</div>
              <div style={{ fontSize: 9, color: "#999" }}>{h.sub}</div>
            </div>
            {h.days.map((d, j) => (
              <div key={j} style={{
                width: 22, height: 22, borderRadius: 11, margin: "0 auto",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
                background: d === 1 ? "rgba(29,158,117,0.15)" : d === 0 ? "rgba(226,75,74,0.1)" : "transparent",
                color: d === 1 ? "#0F6E56" : d === 0 ? "#A32D2D" : "#ddd",
                border: d === null ? "1px solid #e8e8e6" : "none",
              }}>{d === 1 ? "✓" : d === 0 ? "✕" : "—"}</div>
            ))}
          </div>
        ))}

        {/* Weekly progress */}
        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, background: "rgba(29,158,117,0.05)", borderLeft: "3px solid #0F6E56" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#0F6E56" }}>Weekly progress: 78%</div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>You're building strong habits.</div>
        </div>
      </div>
    </Frame>
  );

  const actionCategory = () => (
    <Frame appName="MY PLAN" accent="#185FA5">
      <div style={{ background: "#fff" }}>
        {/* Goal banner */}
        <div style={{ padding: "18px 20px", background: "linear-gradient(135deg, #185FA5, #3B8AE0)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Our goal</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>Build a routine that makes taking your meds easier</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.15)" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)" }}>Target: 68% → 85%+</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>By Jun 30</span>
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {/* Focus areas */}
          <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>Your focus areas</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[
              { name: "Morning timing", tag: "Priority", tagColor: "#A32D2D" },
              { name: "Weekday consistency", tag: "Priority", tagColor: "#A32D2D" },
              { name: "Evening follow-through", tag: "Strength", tagColor: "#0F6E56" },
            ].map((f, i) => (
              <div key={i} style={{ flex: 1, padding: "10px 10px", borderRadius: 10, background: "#f8f8f6", textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a18", marginBottom: 4, lineHeight: 1.3 }}>{f.name}</div>
                <div style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, display: "inline-block", background: f.tagColor + "15", color: f.tagColor, fontWeight: 600 }}>{f.tag}</div>
              </div>
            ))}
          </div>

          {/* Action steps */}
          <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>Your action plan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { step: "Anchor your morning dose", detail: "Pair meds with making coffee", freq: "Daily" },
              { step: "Smart reminder", detail: "7:30 AM on weekdays", freq: "Mon-Fri" },
              { step: "Prepare for busy days", detail: "Set out meds the night before", freq: "Daily" },
              { step: "Weekly check-in", detail: "Quick chat with Maya", freq: "Wednesdays" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "#f8f8f6" }}>
                <div style={{ width: 26, height: 26, borderRadius: 13, background: "rgba(24,95,165,0.1)", color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a18" }}>{a.step}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{a.detail}</div>
                </div>
                <div style={{ fontSize: 9, color: "#999", flexShrink: 0 }}>{a.freq}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );

  const actionOverall = () => (
    <Frame appName="YOUR IMPACT" accent="#185FA5">
      <div style={{ padding: "18px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#888", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>The impact of your progress</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a18", lineHeight: 1.3 }}>You're building a healthier future every day.</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {[
            { label: "Med doses taken consistently", value: "28 of 32", pct: "88%", color: "#534AB7" },
            { label: "Potential setbacks prevented", value: "6", sub: "Great job staying on track!", color: "#0F6E56" },
            { label: "Time and stress saved", value: "3.5 hrs", sub: "Fewer worries, more of your time", color: "#BA7517" },
          ].map((card, i) => (
            <div key={i} style={{ padding: "14px 16px", borderRadius: 12, background: card.color + "08", borderLeft: `3px solid ${card.color}` }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{card.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a18" }}>{card.value}</div>
                {card.pct && <div style={{ fontSize: 14, fontWeight: 700, color: card.color }}>{card.pct}</div>}
              </div>
              {card.sub && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{card.sub}</div>}
            </div>
          ))}
        </div>

        {/* Streak */}
        <div style={{ textAlign: "center", padding: "14px", borderRadius: 12, background: "#f8f8f6" }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Current streak</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#185FA5" }}>9</div>
          <div style={{ fontSize: 11, color: "#185FA5", fontWeight: 600 }}>days in a row</div>
        </div>

        <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(83,74,183,0.05)", fontSize: 12, color: "#555", lineHeight: 1.5 }}>
          All of this progress adds up. You're showing up for your health, and it matters.
        </div>
      </div>
    </Frame>
  );

  // ── Render map ──
  const mockups = {
    score: { measurement: scoreMeasurement, category: scoreCategory, overall: scoreOverall },
    behavior: { measurement: behaviorMeasurement, category: behaviorCategory, overall: behaviorOverall },
    action: { measurement: actionMeasurement, category: actionCategory, overall: actionOverall },
  };

  const commentaries = {
    score: {
      measurement: "Pure data. Each dose logged with its timing and status. The person sees exactly what happened with no editorial layer. This works for data-literate people who want facts, not feedback.",
      category: "Five components rolled into a single adherence score with a ring visualization. The breakdown shows where the person is strong and where they're slipping. The scale at the bottom gives context for what the score means. This is the WHOOP/Oura approach applied to medication.",
      overall: "Medication adherence becomes one of five inputs to a total health score. The person sees that adherence is their strongest category, pulling the overall score up. This can motivate: 'my medication habit is the best thing I do for my health.' The risk: if the overall score drops because of sleep, the person might feel like their medication effort doesn't matter.",
    },
    behavior: {
      measurement: "Same data as the score-focused version, but organized around patterns and obstacles. Instead of 'you scored 72%,' it says 'mornings are harder and here's why.' The insight cards about what's getting in the way turn data into understanding. This is closer to what a therapist would do: reflect the pattern back before suggesting a fix.",
      category: "The behavioral insight score combines pattern recognition with adherence data. The 'what's helping' and 'what to watch' sections make the score actionable. Notice it doesn't just say the number is 74. It says why it's 74, what's pulling it up, and what's pulling it down. This is the coaching philosophy: help people understand themselves.",
      overall: "The data is embedded in a conversation. The coach (Maya) surfaces the drop in adherence, presents patterns she's seeing, and asks the person what might be contributing. The person selects from options rather than interpreting raw data. This is the most supportive frame but also the least transparent: the person doesn't see all their numbers, they see a curated narrative.",
    },
    action: {
      measurement: "The tracker view. Daily checkmarks across multiple med-related habits, organized by the week. The focus is on consistency, not numbers. Missing days are visible but framed as part of a larger pattern, not individual failures. The weekly progress note reinforces the positive trajectory.",
      category: "A full coaching plan with a specific goal (68% to 85% by June 30), identified focus areas (labeled as priorities and strengths), and four concrete action steps with frequencies. This isn't showing the person what happened. It's showing them what to do about it. The plan is prescriptive but personalized.",
      overall: "Instead of showing health scores, this shows the meaning of the data. Setbacks prevented, time saved, streak maintained. The framing is entirely about impact rather than measurement. This is the most motivating frame for people who respond to purpose ('my effort is preventing real problems') but the least transparent about the underlying data.",
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Case study: Medication adherence</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          The same data about the same person's medication-taking behavior, shown through three different design philosophies at three different levels of aggregation. Nine mockups, one question: what story are you telling about this person's health?
        </p>
      </div>

      {/* What we're tracking */}
      <div style={{ marginBottom: 28, padding: "16px 20px", borderRadius: 12, background: "rgba(120,120,110,0.04)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(60,60,55,0.5)", marginBottom: 8 }}>The underlying data</div>
        <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.6, margin: "0 0 10px" }}>
          Alex takes 4 medications daily (2 morning, 2 evening). Over the past 30 days, he took 87% of doses. Morning timing is inconsistent. Evenings are strong. He's been on a 9-day streak. His biggest barrier is rushed mornings on weekdays. His doctor wants him above 85%.
        </p>
        <p style={{ fontSize: 13, color: "rgba(60,60,55,0.65)", lineHeight: 1.6, margin: 0 }}>
          Everything below is the same person, the same data, the same time period. The only thing that changes is how we frame it.
        </p>
      </div>

      {/* Philosophy toggle */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Design philosophy</div>
        <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(120,120,110,0.15)" }}>
          {Object.entries(philosophies).map(([key, val], i, arr) => (
            <button key={key} onClick={() => setPhilosophy(key)} style={{
              flex: 1, padding: "12px 8px", cursor: "pointer", fontSize: 12, fontWeight: philosophy === key ? 700 : 400,
              border: "none", borderRight: i < arr.length - 1 ? "1px solid rgba(120,120,110,0.15)" : "none",
              background: philosophy === key ? val.color + "0c" : "transparent",
              color: philosophy === key ? val.color : "rgba(60,60,55,0.5)",
              transition: "all 0.2s",
            }}>{val.label}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: p.color, marginTop: 8, lineHeight: 1.5 }}>{p.desc}</p>
      </div>

      {/* Level toggle */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Level of aggregation</div>
        <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(120,120,110,0.15)" }}>
          {Object.entries(levels).map(([key, val], i, arr) => (
            <button key={key} onClick={() => setLevel(key)} style={{
              flex: 1, padding: "12px 8px", cursor: "pointer", fontSize: 12, fontWeight: level === key ? 700 : 400,
              border: "none", borderRight: i < arr.length - 1 ? "1px solid rgba(120,120,110,0.15)" : "none",
              background: level === key ? "rgba(120,120,110,0.06)" : "transparent",
              color: level === key ? "#1a1a18" : "rgba(60,60,55,0.5)",
              transition: "all 0.2s",
            }}>{val.label}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "rgba(60,60,55,0.5)", marginTop: 8 }}>{l.desc}</p>
      </div>

      {/* The mockup */}
      <div style={{ marginBottom: 20 }}>
        {mockups[philosophy][level]()}
      </div>

      {/* Commentary */}
      <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(83,74,183,0.04)", borderLeft: `3px solid ${p.color}` }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: p.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Design notes: {p.label} · {l.label}</p>
        <p style={{ fontSize: 13, color: "rgba(60,60,55,0.7)", margin: 0, lineHeight: 1.65 }}>{commentaries[philosophy][level]}</p>
      </div>

      {/* Bottom callout */}
      <div style={{ marginTop: 32, padding: "16px 20px", borderRadius: 12, background: "rgba(120,120,110,0.04)", borderLeft: "3px solid rgba(120,120,110,0.15)" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>The question for your team</p>
        <p style={{ fontSize: 14, color: "rgba(60,60,55,0.7)", lineHeight: 1.7, margin: 0 }}>
          These nine versions use the same data about the same person. The score-focused version makes Alex feel measured. The behavior-focused version makes him feel understood. The action-focused version makes him feel supported. None of these is wrong. The choice depends on who Alex is, what he needs right now, and what your product is trying to do.
        </p>
      </div>
    </div>
  );
};

const LibraryPage = () => {
  const [cards, setCards] = useState([]);
  const [sharedCollections, setSharedCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("grid");
  const [selected, setSelected] = useState([]);
  const [tab, setTab] = useState("mine");
  const [shareDialog, setShareDialog] = useState(false);
  const [shareName, setShareName] = useState("");
  const [shareResult, setShareResult] = useState(null);

  const loadCards = async () => {
    setLoading(true);
    try {
      const list = await storage.list(STORAGE_PREFIX);
      const keys = list?.keys || [];
      const loaded = [];
      for (const key of keys) {
        try {
          const r = await storage.get(key);
          if (r?.value) {
            loaded.push({ id: key.replace(STORAGE_PREFIX, ""), key, ...JSON.parse(r.value) });
          }
        } catch (e) { /* skip */ }
      }
      loaded.sort((a, b) => (b.saved_at || 0) - (a.saved_at || 0));
      setCards(loaded);

      const sharedList = await storage.list(SHARED_PREFIX, true);
      const sharedKeys = sharedList?.keys || [];
      const loadedShared = [];
      for (const key of sharedKeys) {
        try {
          const r = await storage.get(key, true);
          if (r?.value) {
            loadedShared.push({ id: key.replace(SHARED_PREFIX, ""), key, ...JSON.parse(r.value) });
          }
        } catch (e) { /* skip */ }
      }
      loadedShared.sort((a, b) => (b.shared_at || 0) - (a.shared_at || 0));
      setSharedCollections(loadedShared);
    } catch (e) {
      console.error("Load failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCards(); }, []);

  const deleteCard = async (card) => {
    if (!confirm(`Delete "${card.name}"?`)) return;
    try {
      await storage.delete(card.key);
      await loadCards();
    } catch (e) { console.error("Delete failed:", e); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const createCollection = async () => {
    if (selected.length === 0) return;
    const selectedCards = cards.filter(c => selected.includes(c.id));
    const collectionId = generateId();
    const collection = {
      name: shareName.trim() || `Collection of ${selected.length}`,
      cards: selectedCards,
      shared_at: Date.now(),
    };
    try {
      await storage.set(`${SHARED_PREFIX}${collectionId}`, JSON.stringify(collection), true);
      setShareResult({ id: collectionId, name: collection.name, count: selectedCards.length });
      setShareDialog(false);
      setShareName("");
      setSelected([]);
      await loadCards();
    } catch (e) {
      console.error("Share failed:", e);
    }
  };

  const deleteCollection = async (coll) => {
    if (!confirm(`Delete shared collection "${coll.name}"?`)) return;
    try {
      await storage.delete(coll.key, true);
      await loadCards();
    } catch (e) { console.error("Delete failed:", e); }
  };

  const renderCard = (card, opts = {}) => {
    const isSelected = selected.includes(card.id);
    const { compact = false, inCompare = false } = opts;

    return (
      <div key={card.id} style={{
        border: "1px solid", borderColor: isSelected ? card.state_color : "rgba(120,120,110,0.15)",
        borderRadius: 12, padding: compact ? "14px 16px" : "16px 18px",
        background: isSelected ? card.state_color + "08" : "rgba(255,255,252,0.6)",
        transition: "all 0.15s",
        position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: card.state_color + "15", color: card.state_color, fontWeight: 600 }}>{card.state_label}</span>
              <span style={{ fontSize: 10, color: "rgba(60,60,55,0.35)" }}>{card.tool_label}</span>
              <span style={{ fontSize: 10, color: "rgba(60,60,55,0.3)" }}>· {formatDate(card.saved_at)}</span>
            </div>
            <div style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: "#1a1a18", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis" }}>
              {card.name}
            </div>
          </div>
          {mode === "grid" && !inCompare && (
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <button onClick={() => toggleSelect(card.id)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                border: "1px solid", borderColor: isSelected ? card.state_color : "rgba(120,120,110,0.2)",
                background: isSelected ? card.state_color + "15" : "transparent",
                color: isSelected ? card.state_color : "rgba(60,60,55,0.5)",
                fontWeight: isSelected ? 600 : 400,
              }}>{isSelected ? "✓" : "+"}</button>
              <button onClick={() => deleteCard(card)} style={{
                padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                border: "1px solid rgba(120,120,110,0.15)", background: "transparent",
                color: "rgba(60,60,55,0.35)",
              }}>✕</button>
            </div>
          )}
        </div>
        <CardPreview card={card} condensed={compact && mode === "grid"} />
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "rgba(60,60,55,0.5)" }}>Loading library...</div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1a1a18", letterSpacing: -0.5 }}>Library</h1>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.6, maxWidth: 640 }}>
          Cards you've saved from the tools. Select 2-3 to compare side by side, or bundle a set into a shared collection that anyone who opens this site can see.
        </p>
      </div>

      {shareResult && (
        <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(29,158,117,0.06)", borderLeft: "3px solid #1D9E75" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F6E56", marginBottom: 4 }}>✓ Collection "{shareResult.name}" created</div>
          <div style={{ fontSize: 12, color: "rgba(60,60,55,0.6)" }}>Find it under the "Shared with everyone" tab below. {shareResult.count} card{shareResult.count !== 1 ? "s" : ""} included.</div>
          <button onClick={() => { setShareResult(null); setTab("shared"); }} style={{
            marginTop: 8, padding: "4px 12px", fontSize: 11, borderRadius: 6, border: "1px solid rgba(29,158,117,0.3)",
            background: "transparent", color: "#0F6E56", cursor: "pointer",
          }}>View shared collections</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid rgba(120,120,110,0.12)" }}>
        {[
          { id: "mine", label: `My saved cards${cards.length ? ` (${cards.length})` : ""}` },
          { id: "shared", label: `Shared with everyone${sharedCollections.length ? ` (${sharedCollections.length})` : ""}` },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelected([]); setMode("grid"); }} style={{
            padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
            border: "none", background: "transparent",
            color: tab === t.id ? "#1a1a18" : "rgba(60,60,55,0.5)",
            borderBottom: tab === t.id ? "2px solid #1D9E75" : "2px solid transparent",
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "mine" && (
        <>
          {cards.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", borderRadius: 12, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ fontSize: 14, color: "rgba(60,60,55,0.5)", marginBottom: 6 }}>No saved cards yet</div>
              <div style={{ fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Generate a persona or coaching view in the Tools section and tap "Save to library"</div>
            </div>
          ) : (
            <>
              {/* Action bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "rgba(120,120,110,0.03)" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => { setMode("grid"); }} style={{
                    padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                    border: "1px solid", borderColor: mode === "grid" ? "rgba(29,158,117,0.3)" : "rgba(120,120,110,0.15)",
                    background: mode === "grid" ? "rgba(29,158,117,0.08)" : "transparent",
                    color: mode === "grid" ? "#0F6E56" : "rgba(60,60,55,0.6)",
                    fontWeight: mode === "grid" ? 600 : 400,
                  }}>Grid</button>
                  <button onClick={() => { if (selected.length >= 2) setMode("compare"); }} disabled={selected.length < 2} style={{
                    padding: "6px 12px", borderRadius: 6, fontSize: 12,
                    cursor: selected.length >= 2 ? "pointer" : "default",
                    border: "1px solid", borderColor: mode === "compare" ? "rgba(29,158,117,0.3)" : "rgba(120,120,110,0.15)",
                    background: mode === "compare" ? "rgba(29,158,117,0.08)" : "transparent",
                    color: selected.length >= 2 ? (mode === "compare" ? "#0F6E56" : "rgba(60,60,55,0.6)") : "rgba(60,60,55,0.25)",
                    fontWeight: mode === "compare" ? 600 : 400,
                  }}>Compare ({selected.length}/3)</button>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {selected.length > 0 && (
                    <>
                      <span style={{ fontSize: 11, color: "rgba(60,60,55,0.5)" }}>{selected.length} selected</span>
                      <button onClick={() => setShareDialog(true)} style={{
                        padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                        border: "1px solid rgba(55,138,221,0.3)", background: "rgba(55,138,221,0.06)",
                        color: "#185FA5", fontWeight: 600,
                      }}>Share as collection</button>
                      <button onClick={() => setSelected([])} style={{
                        padding: "6px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                        border: "1px solid rgba(120,120,110,0.15)", background: "transparent", color: "rgba(60,60,55,0.5)",
                      }}>Clear</button>
                    </>
                  )}
                </div>
              </div>

              {/* Share dialog */}
              {shareDialog && (
                <div style={{ marginBottom: 16, padding: "16px 18px", borderRadius: 10, border: "1px solid rgba(55,138,221,0.25)", background: "rgba(55,138,221,0.03)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", marginBottom: 10 }}>Share {selected.length} card{selected.length !== 1 ? "s" : ""} as a collection</div>
                  <div style={{ fontSize: 12, color: "rgba(60,60,55,0.6)", marginBottom: 10, lineHeight: 1.5 }}>
                    Collections are visible to everyone who opens this site. Name this collection so others know what it contains.
                  </div>
                  <input type="text" value={shareName} onChange={e => setShareName(e.target.value)}
                    placeholder={`e.g. Diabetes coaching options, ${new Date().toLocaleDateString()}`}
                    autoFocus
                    onKeyDown={e => { if (e.key === "Enter") createCollection(); if (e.key === "Escape") setShareDialog(false); }}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: 6, border: "1px solid rgba(120,120,110,0.2)", outline: "none", marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={createCollection} style={{
                      padding: "8px 16px", borderRadius: 6, border: "none", background: "#185FA5", color: "#fff",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>Create collection</button>
                    <button onClick={() => { setShareDialog(false); setShareName(""); }} style={{
                      padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(120,120,110,0.2)",
                      background: "transparent", color: "rgba(60,60,55,0.5)", fontSize: 12, cursor: "pointer",
                    }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Cards */}
              {mode === "grid" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                  {cards.map(c => renderCard(c, { compact: true }))}
                </div>
              )}
              {mode === "compare" && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${selected.length}, 1fr)`, gap: 12 }}>
                  {cards.filter(c => selected.includes(c.id)).map(c => renderCard(c, { inCompare: true }))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {tab === "shared" && (
        <>
          {sharedCollections.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", borderRadius: 12, background: "rgba(120,120,110,0.03)" }}>
              <div style={{ fontSize: 14, color: "rgba(60,60,55,0.5)", marginBottom: 6 }}>No shared collections yet</div>
              <div style={{ fontSize: 12, color: "rgba(60,60,55,0.35)" }}>Select cards from your library and create a collection to share with everyone.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sharedCollections.map(coll => (
                <div key={coll.id} style={{ border: "1px solid rgba(55,138,221,0.2)", borderRadius: 12, background: "rgba(55,138,221,0.02)" }}>
                  <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(55,138,221,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a18" }}>{coll.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(60,60,55,0.4)", marginTop: 2 }}>
                        {coll.cards?.length || 0} card{coll.cards?.length !== 1 ? "s" : ""} · Shared {formatDate(coll.shared_at)}
                      </div>
                    </div>
                    <button onClick={() => deleteCollection(coll)} style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                      border: "1px solid rgba(120,120,110,0.15)", background: "transparent", color: "rgba(60,60,55,0.4)",
                    }}>Delete</button>
                  </div>
                  <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                    {(coll.cards || []).map((c, i) => (
                      <div key={i} style={{
                        padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(120,120,110,0.12)",
                        background: "rgba(255,255,252,0.6)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: c.state_color + "15", color: c.state_color, fontWeight: 600 }}>{c.state_label}</span>
                          <span style={{ fontSize: 10, color: "rgba(60,60,55,0.35)" }}>{c.tool_label}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a18", marginBottom: 8, lineHeight: 1.3 }}>{c.name}</div>
                        <CardPreview card={c} condensed={true} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};


/* ─── PAGE: Case Study - Medication Adherence ─── */
const LandingPage = ({ onNavigate }) => {
  const measurements = [
    {
      id: "raw", num: "56", label: "Raw measurements",
      desc: "The actual numbers from your body and behavior. Heart rate, blood glucose, steps, lab results, self-reports. What each one is, how often you take it, what it connects to, and who does the measuring.",
      color: "#BA7517",
    },
    {
      id: "categories", num: "17", label: "Categories",
      desc: "How raw measurements group into health areas like sleep, activity, stress, and heart health. Each category shows which measurements feed it and how they connect.",
      color: "#185FA5",
    },
    {
      id: "overall", num: "5", label: "Overall",
      desc: "The big rollups. WHOOP Age, dacadoo Health Score, CMS Star Ratings. A single number for your overall health. The most ambitious and the most contested. When to use one, when not to, and how real companies are doing it.",
      color: "#534AB7",
    },
  ];

  const presentation = [
    {
      id: "representation", label: "Numbers & narratives",
      desc: "Numbers, narratives, or both. How health data is displayed changes what people understand, how they feel, and what they do next.",
      icon: "4",
    },
    {
      id: "trends", label: "Time & trends",
      desc: "How to show change over time. Time windows, reference frames, and how to communicate direction. With the hard cases: plateaus, reversals, noise, and missing data.",
      icon: "5",
    },
    {
      id: "approaches", label: "Framing choices",
      desc: "Twelve different ways to frame someone's health, from raw data only to a single overall number to impact-focused views. Each with a visual example, when to use it, and what to watch out for.",
      icon: "6",
    },
  ];

  const caseStudies = [
    {
      id: "med_adherence", label: "Medication adherence",
      desc: "A worked example showing the same data across three levels (individual measurements, category, overall) and three design philosophies (score-focused, behavior-focused, support-focused). Nine mockups total.",
      icon: "◈",
    },
  ];

  const tools = [
    {
      id: "decision", label: "Decision helper",
      desc: "Should your feature include a score? Walk through a set of questions to figure out what fits your product context.",
      icon: "?",
    },
    {
      id: "persona", label: "Same person, different lens",
      desc: "Describe a person, then see what their health data looks like when they're doing great, getting by, and struggling.",
      icon: "◉",
    },
    {
      id: "coaching", label: "Coaching topic options",
      desc: "Pick a health coaching topic and see what the experience looks like across different presentation approaches and cadences.",
      icon: "♡",
    },
  ];

  const renderCardGrid = (items, type) => (
    <div style={{ display: "grid", gridTemplateColumns: type === "large" ? "1fr" : "1fr 1fr", gap: 12 }}>
      {items.map((item, i) => (
        <div key={item.id} onClick={() => onNavigate(item.id)} style={{
          display: "flex", gap: type === "large" ? 20 : 14, alignItems: "flex-start", padding: type === "large" ? "20px 24px" : "16px 20px",
          borderRadius: 14, border: "1px solid rgba(120,120,110,0.12)", cursor: "pointer",
          background: "rgba(255,255,252,0.6)", transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; e.currentTarget.style.background = "rgba(29,158,117,0.03)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(120,120,110,0.12)"; e.currentTarget.style.background = "rgba(255,255,252,0.6)"; }}
        >
          {type === "large" ? (
            <div style={{
              width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: item.color + "10",
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.num}</span>
            </div>
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: "rgba(120,120,110,0.06)", fontSize: 13, fontWeight: 700, color: "rgba(60,60,55,0.4)",
            }}>{item.icon}</div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: type === "large" ? 15 : 14, fontWeight: 700, color: "#1a1a18", margin: "0 0 4px" }}>{item.label}</p>
            <p style={{ fontSize: 13, color: "rgba(60,60,55,0.6)", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
          </div>
          <span style={{ fontSize: 16, color: "rgba(60,60,55,0.15)", marginTop: 2 }}>→</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1a1a18", letterSpacing: -1, lineHeight: 1.15, marginBottom: 16 }}>
          The landscape of<br />health numbers
        </h1>
        <p style={{ fontSize: 17, color: "rgba(60,60,55,0.6)", lineHeight: 1.7, maxWidth: 560 }}>
          A reference and toolkit for product teams working on health features. Understand what numbers exist, how they group into categories and overall scores, how to present them, and whether scoring is right for what you're building.
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(60,60,55,0.35)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>Measurements</p>
        {renderCardGrid(measurements, "large")}
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(60,60,55,0.35)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>Presentation</p>
        {renderCardGrid(presentation, "small")}
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(60,60,55,0.35)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>Tools</p>
        {renderCardGrid(tools, "small")}
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(60,60,55,0.35)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>Workshop</p>
        {renderCardGrid([...caseStudies, {
          id: "library", label: "Library",
          desc: "View and compare the persona and coaching views you've saved. Bundle sets into collections and share them with others.",
          icon: "◘",
        }], "small")}
      </div>

      <div style={{ padding: "24px 28px", borderRadius: 14, background: "rgba(120,120,110,0.04)", borderLeft: "3px solid rgba(120,120,110,0.15)" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(60,60,55,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>The core tension</p>
        <p style={{ fontSize: 15, color: "rgba(60,60,55,0.7)", lineHeight: 1.7, margin: 0 }}>
          Raw measurements are precise but overwhelming. Overall scores are simple but opaque. The category level in the middle is where most useful action happens today, and where every company encodes a different point of view about what matters. How these numbers are represented, whether as scores, narratives, or both, shapes what people actually do with them. Understanding this landscape is the first step to making good product decisions about health numbers.
        </p>
      </div>
    </div>
  );
};

/* ─── NAVIGATION ─── */
const PAGES = [
  { id: "home", label: "Overview", section: "", icon: "◊" },
  { id: "raw", label: "Raw measurements", section: "Measurements", icon: "1" },
  { id: "categories", label: "Categories", section: "Measurements", icon: "2" },
  { id: "overall", label: "Overall", section: "Measurements", icon: "3" },
  { id: "representation", label: "Numbers & narratives", section: "Presentation", icon: "4" },
  { id: "trends", label: "Time & trends", section: "Presentation", icon: "5" },
  { id: "approaches", label: "Framing choices", section: "Presentation", icon: "6" },
  { id: "decision", label: "Decision helper", section: "Tools", icon: "?" },
  { id: "persona", label: "Same person, different lens", section: "Tools", icon: "◉" },
  { id: "coaching", label: "Coaching topic options", section: "Tools", icon: "♡" },
  { id: "med_adherence", label: "Medication adherence", section: "Workshop", icon: "◈" },
  { id: "library", label: "Library", section: "Workshop", icon: "◘" },
];

const Nav = ({ current, onChange }) => {
  let lastSection = "";
  return (
    <nav style={{
      width: 240, flexShrink: 0, padding: "28px 0", borderRight: "1px solid rgba(120,120,110,0.12)",
      display: "flex", flexDirection: "column", gap: 2, height: "100vh", position: "sticky", top: 0,
      overflowY: "auto",
    }}>
      <div onClick={() => onChange("home")} style={{ padding: "0 20px 20px", marginBottom: 8, borderBottom: "1px solid rgba(120,120,110,0.1)", cursor: "pointer" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a18", margin: 0, letterSpacing: -0.3 }}>Health numbers</h2>
        <p style={{ fontSize: 11, color: "rgba(60,60,55,0.45)", margin: "4px 0 0" }}>A conceptual landscape</p>
      </div>
      {PAGES.map(p => {
        const showSection = p.section !== lastSection;
        lastSection = p.section;
        return (
          <div key={p.id}>
            {showSection && p.section && (
              <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(60,60,55,0.4)", textTransform: "uppercase", letterSpacing: 1, padding: "14px 20px 4px", margin: 0 }}>{p.section}</p>
            )}
            <button onClick={() => onChange(p.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "8px 20px", border: "none", cursor: "pointer", textAlign: "left",
              background: current === p.id ? "rgba(29,158,117,0.08)" : "transparent",
              borderRight: current === p.id ? "2px solid #1D9E75" : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                background: current === p.id ? "rgba(29,158,117,0.15)" : "rgba(120,120,110,0.08)",
                color: current === p.id ? "#0F6E56" : "rgba(60,60,55,0.4)",
              }}>{p.icon}</span>
              <span style={{
                fontSize: 13, fontWeight: current === p.id ? 600 : 400,
                color: current === p.id ? "#0F6E56" : "rgba(60,60,55,0.7)",
              }}>{p.label}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
};

/* ─── MAIN APP ─── */
export default function HealthTrackingApp() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <LandingPage onNavigate={setPage} />;
      case "raw": return <RawMeasurementsPage />;
      case "categories": return <CategoriesPage />;
      case "overall": return <CompositeScoresPage />;
      case "representation": return <RepresentationPage />;
      case "trends": return <TimeAndTrendsPage />;
      case "approaches": return <ApproachesPage />;
      case "med_adherence": return <MedAdherenceCaseStudy />;
      case "decision": return <DecisionHelperPage />;
      case "persona": return <PersonaLensPage />;
      case "coaching": return <CoachingToolPage />;
      case "library": return <LibraryPage />;
      default: return <LandingPage onNavigate={setPage} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif", background: "#FAFAF7" }}>
      <Nav current={page} onChange={setPage} />
      <main style={{ flex: 1, padding: "36px 48px", maxWidth: 860, overflowY: "auto" }}>
        {renderPage()}
      </main>
    </div>
  );
}
