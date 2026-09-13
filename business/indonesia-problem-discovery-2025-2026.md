# Indonesia Problem Discovery, 2025–2026

## Executive summary

This reworked digital-product study classifies fifty-nine recurring problems reported by Indonesian consumers, workers, small sellers, taxpayers, patients, commuters, job seekers, caregivers, farmers, parents, disabled passengers, investors, and software builders between January 2025 and September 2026. It retains the original evidence cards, adds a product-fit classification for every card, deduplicates the strongest signals into ten digital-product opportunity clusters, and ranks those clusters using customer pain, digital leverage, evidence strength, workaround intensity, and buyer reachability. The evidence comes from official complaint data, app-store reviews and developer replies, Reddit and other public forums, published social posts, Product Hunt, Hacker News, support responses, surveys, and interview-based studies.

The most promising digital-product opportunities are not generic “make an app” spaces. They are moments where an existing digital service fails and the customer must improvise across channels:

1. Recover a payment or balance that was deducted but not delivered.
2. Prove, escalate, and resolve a failed marketplace, financial, tax, or property transaction.
3. Know whether a public service, delivery, appointment, internet connection, or job opportunity is genuinely available before spending time or money.
4. Help informal sellers operate across WhatsApp, bank transfer, COD, QRIS, marketplaces, and manual records without losing margin or trust.
5. Give job seekers a trustworthy application workflow that filters fraud, exposes stale listings, and makes follow-up visible.

The scan does not claim that online complaints represent the whole population. App reviews and forums are self-selected and skew negative. Frequency is therefore reported in three layers: measured survey or administrative incidence, repeated signal across independent sources, and anecdotal signal. Severity reflects money at risk, time lost, safety or health exposure, income impact, and reversibility.

No new direct participant interview or prototype usability observation was completed for this implementation. Published interview studies are identified as interviews; public posts are not relabeled as interviews. The ranked list is therefore a public-evidence ranking, while the top three remain provisional until direct user interviews and observed prototype tasks are completed.

## Research audit

This is a digital-opportunity audit, not an exhaustive count of every problem in Indonesia. The current inventory contains 59 cards and 97 original listed sources; this pass adds a product-fit crosswalk, a weighted ranking, and a fresh source refresh. Official complaint and regulatory evidence is strongest, app reviews and forums are useful for the last incident and workaround, and Product Hunt/Hacker News are sparse for Indonesia-specific customer prevalence.

The evidence classes actually represented are: official complaint or regulator records; app-store reviews and developer replies; Reddit, parenting, finance, and local forums; social and news reporting; published surveys; published qualitative interviews; support or complaint workflows; Product Hunt maker/customer discussions; and Hacker News comparative infrastructure discussion. The Hacker News results did not produce a strong Indonesia-specific 2025–26 customer case, so that channel is not used to inflate a problem’s evidence strength. Public developer replies and regulator workflows are support evidence; private support tickets were not available. “Direct interview” means an interview conducted by the research team with a participant. That count is zero in this implementation. No user was contacted, called, observed, or asked to complete a prototype, so the top-three field-validation status is explicitly pending.

## How to read the evidence

| Evidence strength | Meaning |
|---|---|
| High | At least one official or interview-based source plus independent user evidence; frequency or consequence is measured. |
| Medium | Repeated user reports plus one credible survey, administrative source, or specialist study; some prevalence limits remain. |
| Low | A real user or maker signal, but prevalence, segment size, or willingness to pay is not yet established. |

“Last faced” means the latest dated incident found in the cited record, not a claim that the person’s problem ended then. “Cost” is stated only when the source gives a number; otherwise the operational cost is described and marked as unquantified.

## Opportunity landscape

| # | Problem | Primary customer | Last observed evidence | Frequency | Severity | Evidence |
|---:|---|---|---|---|---|---|
| 1 | Marketplace post-purchase failure: wrong, late, damaged, counterfeit, or hard-to-refund goods | Online shopper | Jul–Aug 2025 survey; Jun 2025 app review | 91% of 800 surveyed shoppers had a difficulty; late delivery 41%, difficult refund 25% | High when money or essential goods are stuck | High |
| 2 | Digital payments fail after money has been deducted | E-wallet / bank customer | Jan 2025 DANA review; 2025–26 review corpus | 69,006 reviews show failure themes; official complaints are in the tens of thousands | High | High |
| 3 | Scam recovery is too slow and fragmented | Consumer, seller, job seeker, renter | Mar 2025 IASC; Jun 2025 Reddit incident | 74,243 IASC reports and Rp1.4T reported loss by 23 Mar 2025 | Very high | High |
| 4 | Coretax and government digital identity workflows are hard to complete | Taxpayer, freelancer, payroll administrator | Jan–Mar 2025 incidents and Ombudsman warning | Repeated official issue categories plus widespread public reports; exact user denominator unavailable | High near deadlines or payroll | High |
| 5 | BPJS / outpatient access still depends on opaque queues, OTP, and facility capacity | Patient or caregiver | Jan–Mar 2025 Mobile JKN reviews; 2025 patient complaint research | 1M+ Mobile JKN reviews; 18% of cited hospital complaints are waiting time | High for time-sensitive care | High |
| 6 | Internet service is unreliable and support does not provide trustworthy resolution | WFH worker, household, small business | 2025–26 APJII data; Jul 2025 MyTelkomsel review | Mobile: 29.5% slow network and 29% weak signal in early 2026 | Medium–high; high for work or school | High |
| 7 | Public transport does not solve the first/last mile or provide predictable travel time | Metropolitan commuter | 2025 mobility outlook; Apr 2025 commuter discussion | Bandung case: public transport 2.2× longer and 18% more expensive than motorcycle/ride-hailing | Medium–high, recurring daily | High |
| 8 | Platform workers cannot predict net earnings or why algorithms penalize them | Ojol, courier, home-service worker | Jan–Mar 2025 interviews; Oct 2025 driver survey | 80 interviewed workers; 40-driver reporting survey; 1,052-driver telephone survey | Very high for livelihood and safety | High |
| 9 | Housing buyers cannot verify delivery, title, developer accountability, or refunds | Home or apartment buyer | 2025 BPKN / PKP data; Apr 2026 legal consultation | 851 BPKN complaints in 2025; Rp402B of Rp438.3B potential loss was property-related | Very high | High |
| 10 | Online job search consumes hours while listings are ghosted, mismatched, or fraudulent | Job seeker | Aug 2025 Reddit post; 2025 parliamentary brief | One person: 100+ applications, 20+ minutes each, zero calls; Jobstreet removed 2,800 postings | High due to lost income and fraud risk | Medium–high |
| 11 | Informal social-commerce sellers operate through fragmented, manual workflows | WhatsApp / social seller, disproportionately women | Aug–Dec 2024 interviews reported Sep 2025 | 428 quantitative respondents and 30 qualitative interviews; 79% record transactions, only 7% digitally | Medium–high for growth and cash flow | High |
| 12 | Indonesian SaaS builders face local-payment and billing integration friction | Developer / startup founder | 2025 Product Hunt launch; Hacker News discussion | No population estimate; one direct maker signal | Medium for builder time and launch delay | Low–medium |

## Problem cards

### 1. Marketplace post-purchase failure

**Target customer and situation.** An Indonesian shopper buys an item whose quality, delivery time, or authenticity matters, then needs a dependable way to verify what happened and recover money without repeatedly negotiating with the seller, courier, and marketplace.

**Customer’s own words.** A July–August 2025 survey of 800 marketplace consumers found that 91% had experienced a shopping difficulty. The reported problems were: “barang tak sesuai harapan” (goods not as expected, 48%), late delivery (41%), damaged or defective goods (32%), expensive shipping (28%), and difficult return/refund (25%). Customer service was unresponsive for 21% of respondents. [Kumparan survey summary via Databoks, 22 Sep 2025](https://databoks.katadata.co.id/teknologi-telekomunikasi/statistik/68d129c55020f/ragam-kendala-konsumen-marketplace-di-indonesia).

An English-language Shopee review dated 23 Mar 2025 said purchases above Rp100,000 were repeatedly cancelled for “unusual activity”; the customer said support blamed them and that the experience made them consider changing platforms. A Jun 2025 review described the app as laggy and a missing-item case as closed without a refund. [Shopee Google Play reviews](https://play.google.com/store/apps/details?gl=US&hl=en&id=com.shopee.id).

**Frequency and severity.** Frequency is high in the measured survey: 91% encountered at least one difficulty. The most important recurring failures are not browsing problems; they occur after payment. Severity is high when the customer needs an essential item, the seller disputes the evidence, or money remains in a closed case.

**Last time faced, action, and cost.** The latest dated app evidence used here is Jun 2025. The shopper tried the case process, then contacted support; the platform reply redirected them to social-media support. Cost was the item’s price plus time spent collecting evidence and chasing resolution. The survey does not quantify average refund time or money lost, which should be measured directly in follow-up research.

**Current workaround / competing product.** Buyers switch between Shopee, Tokopedia, TikTok Shop, and offline stores; use seller chat and platform dispute flows; buy from Mall / official stores; or accept the loss when the amount is small. Sellers and buyers also use WhatsApp and bank transfer for trusted repeat relationships, trading platform protection for personal trust.

**Evidence judgment.** High for prevalence of post-purchase friction; medium for willingness to pay for a resolution layer. The feature request “better customer service” is only a clue. The deeper job is “tell me whether my money and item are recoverable, and prove the next step.”

### 2. Digital payments fail after money has been deducted

**Target customer and situation.** A consumer tops up, pays by QRIS, transfers money, or loads a transit card. The app reports an error, the balance is deducted, the recipient or card is not credited, and support requests more evidence than the customer can easily produce.

**Customer’s own words.** A DANA review dated 2 Jan 2025 said: “I made a transfer, and my balance has been deducted. The transaction is marked as successful, but the funds did not reach the account.” The reviewer said they complained through DANA’s bot, Instagram, call centre, and email, then were logged out and could not log back in. The review received 620 helpful votes. [DANA Google Play](https://play.google.com/store/apps/details?id=id.dana).

In a GoPay review dated 7 Aug 2026, a user said the payment went through but the e-money card balance did not increase, even after three attempts; “the GoPay balance is deducted, but nothing is added to the card, and a refund isn’t possible.” [GoPay Google Play](https://play.google.com/store/apps/details?id=com.gojek.gopay).

**Frequency and severity.** An analysis of 69,006 Indonesian-language Google Play reviews across six e-wallets, covering Nov 2025–May 2026, found recurring themes of failed top-ups and transfers, fees, crashes or lost access, and customer-service responsiveness. These failure themes were associated with lower ratings. [Januardi & Hasya, IRJEMS, 2026](https://irjems.org/irjems-v5i6p112.html). OJK received 31,456 financial-service complaints from 1 Jan to 15 Aug 2025, including 12,090 banking and 11,687 fintech complaints. [OJK, 2025](https://www.ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Pages/Financial-Services-Sector-Stability-Maintained-Amid-Global-and-Domestic-Dynamics.aspx).

Severity is high because the failure combines money at risk, uncertainty, and loss of access to the recovery channel. It is more severe for payroll, rent, healthcare, transport, and small sellers who need cash flow immediately.

**Last time faced, action, and cost.** The Jan 2025 DANA user tried four support channels and still lost access. The explicit cost is an uncredited transfer and time spent across at least four channels; the amount was not disclosed. The GoPay user faced the problem three times. These cases show that the cost is not only the transaction amount; it is the inability to know whether to wait, retry, or escalate.

**Current workaround / competing product.** Users retry, clear cache, reinstall, switch to another wallet, use bank transfer or cash, and screenshot every step. Developers often reply with generic troubleshooting and an email ticket, which is a support workaround rather than resolution.

**Evidence judgment.** High. A promising product direction is transaction recovery and evidence orchestration across providers, not another wallet. A prototype should test whether users can identify the transaction state, avoid unsafe retries, and generate a complete escalation packet in under two minutes.

### 3. Scam recovery is too slow and fragmented

**Target customer and situation.** A consumer, seller, job seeker, or renter is pressured into a transfer or data disclosure and realizes the fraud only after funds leave. They need an immediate, coordinated way to freeze accounts, preserve evidence, and understand what recovery is realistic.

**Customer’s own words.** In a Jun 2025 Reddit incident, a user described a seller claiming a transfer was wrong and demanding additional payments. The user wrote that they had nearly sent more than Rp10 million and were “marah stres berhari-hari” (angry and stressed for days). [Reddit, 10 Jun 2025](https://www.reddit.com/r/indonesia/comments/1l7yoib/penipuan-berkedok-misi-wfh/).

In another public account, a renter urgently looking for a kos paid Rp300,000, was pressured to send more, and eventually reported to GoPay that it could do nothing because the transfer had gone from a bank into GoPay. Other commenters advised reporting to both banks but said the bank might only block the account, not return the money. [Reddit, 1 Nov 2024, still relevant to the 2025–26 recovery workflow](https://www.reddit.com/r/indonesia/comments/1gh3x65/barusan-kena-scam-uang-sudah-pasti-melayang-ada/).

**Frequency and severity.** IASC had received 74,243 reports by 23 Mar 2025, involving 78,041 reported accounts; 33,857 were blocked. Reported losses were Rp1.4 trillion, with Rp133.2 billion blocked. [OJK IASC, 23 Mar 2025](https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Waspada-Penipuan-Website-Mengatasnamakan-Indonesia-Anti-Scam-Centre-IASC.aspx). This is a measured, high-frequency signal, though it includes reports rather than unique victims and underreporting is likely.

**Last time faced, action, and cost.** In the Jun 2025 case, the user used background checks, hit the transfer limit, and spent days distressed. In the kos case, the user contacted the payment provider and considered banks and police. Costs range from Rp300,000 to more than Rp10 million in the cited accounts, plus emotional distress and time. The official data shows the system-level cost is much larger.

**Current workaround / competing product.** Victims contact their bank, receiving wallet, police, IASC, platform, and sometimes social media; they post warnings to prevent more victims; they use transfer limits, COD, QRIS, and community reputation checks. Current recovery is institution-by-institution.

**Evidence judgment.** High severity and high measured activity. The opportunity is a trusted incident-response workflow: “stop, freeze, preserve, report, track.” Any product must avoid creating a second scam channel and should be evaluated with safety experts and financial institutions.

### 4. Coretax and government digital identity workflows are hard to complete

**Target customer and situation.** A taxpayer, freelancer, payroll administrator, or small business must activate an account, match NIK and NPWP, receive an OTP, reset a password, submit a report, or pay a tax near a deadline.

**Customer’s own words.** A Feb 2025 Reddit post described NIK registration producing “error 500,” validation email failures, “email already registered,” and reset links that also returned error 500. The author wrote that their office said salary could not be paid if NIK was not in Coretax because tax reporting could not be completed. [Reddit, 27 Feb 2025](https://www.reddit.com/r/indonesia/comments/1izcbxu/ada-yang-kesulitan-pas-registrasi-nik-di-coretax/).

The Directorate General of Taxes’ own Jan 2025 issue document listed missing OTPs, slow OTP delivery, failed login after password reset, registration-menu failures, NIK–NPWP matching, failed face validation, and pre-Coretax tax debt data not being available. [DJP, technical issues after Coretax implementation, 21 Jan 2025](https://pajak.go.id/sites/default/files/2025-01/Solusi%20atas%20Kondisi%20Teknis%20Pascaimplementasi%20Coretax%20DJP%20Versi%20Tanggal%2021%20Januari%202025.pdf). Ombudsman warned in Feb 2025 that unresolved complaints could create potential maladministration. [Ombudsman RI, 12 Feb 2025](https://ombudsman.go.id/pers/r/-banyak-dikeluhkan-pengguna-ombudsman-ingatkan-potensi-maladministrasi-pada-coretax).

**Frequency and severity.** The official document proves multiple distinct failure modes, not prevalence. Public reports repeated the same categories around March deadlines. Severity is high when access affects payroll, tax filing, business invoicing, or penalties.

**Last time faced, action, and cost.** The cited user retried at different times, consulted Reddit, and went to the local tax office; the office repeated the same troubleshooting and told them to wait. The cost was repeated attempts, a KPP visit, deadline risk, and possible salary disruption. No reliable monetary cost was disclosed.

**Current workaround / competing product.** Taxpayers use KPP offices, tax consultants, WhatsApp groups, Reddit, older DJP Online flows where still available, and informal step-by-step guides. The workaround is human interpretation of error states.

**Evidence judgment.** High for problem reality and severity; medium for market size. Treat “make Coretax simpler” as too broad. The testable job is “diagnose my exact blocked state and give me the one next action that will work, with a fallback before the deadline.”

### 5. BPJS and outpatient access still depends on opaque queues, OTP, and facility capacity

**Target customer and situation.** A patient or caregiver needs an appointment, referral, queue number, or member verification. They cannot tell whether the next slot is truly available, whether the OTP will arrive, or how long the on-site queue will be.

**Customer’s own words.** A Mobile JKN review dated 10 Jan 2025 said: “Gak jelas harus ambil antrean jam berapa” (it is unclear what time to take the queue). The user had been told to control three weeks earlier, found the schedule full, saw “data not found/tutup,” and then found it suddenly full again. BPJS replied by directing them to Care Center 165 or Mobile JKN’s complaint feature. [Mobile JKN Google Play](https://play.google.com/store/apps/details?hl=fr_CH&id=app.bpjs.mobile).

Another review on 17 Mar 2025 simply said there was a problem registering through the phone number; BPJS replied that the number must be active and have sufficient prepaid credit for OTP delivery. The published 2025 hospital-complaint summary cited registration administration as 28% of complaints and waiting time as 18%, with BPJS verification and inconsistent information among staff also reported. [Journal of Community Health Provision, 2025](https://www.psppjournals.org/index.php/jchp/article/download/946/967).

**Frequency and severity.** Mobile JKN shows more than one million reviews, but reviews are not a prevalence estimate. The repeated queue, OTP, and registration categories are supported by app reviews and hospital research. Severity is high for chronic-care follow-ups, elderly patients, caregivers, and anyone who must take time off work.

**Last time faced, action, and cost.** The Jan 2025 user tried to book before the appointment window, encountered “data not found,” and was told to contact support. The cost was delayed care and time spent monitoring the queue; no monetary amount was given.

**Current workaround / competing product.** Patients call 165, arrive early, ask facility staff, use hospital-specific apps or WhatsApp, book at midnight when slots open, switch facilities, or pay privately when delay is unacceptable. This is a queue-management and capacity-transparency problem, not only an app problem.

**Evidence judgment.** High. A prototype should be tested with caregivers, older users, and low-connectivity users. Success is not “the app has more features”; it is whether a user can tell, before leaving home, what is guaranteed, what is tentative, and what to do when the slot disappears.

### 6. Internet service is unreliable and support does not provide trustworthy resolution

**Target customer and situation.** A household, WFH worker, student, or small business needs dependable connectivity. When the connection fails, they need a truthful outage status, an ETA, technician accountability, and a fair billing adjustment.

**Customer’s own words.** A Jul 2025 MyTelkomsel review said that after an update the reviewer could not open the app to buy a package; restarting did not help, and reinstalling was the only way to make it work. The reviewer wrote: “Contacting customer service via Instagram or email isn't the solution. Fixing the app is the solution.” Telkomsel replied with cache-clearing steps and a support-channel referral. [MyTelkomsel Google Play](https://play.google.com/store/apps/details?id=com.telkomsel.telkomselcm).

In a Feb 2025 Indonesian forum discussion, one user reported moving from FirstMedia because the price had risen and real speed was about 15 Mbps versus “up to 50 Mbps”; another said a previous provider had been down for five days while they were WFH. A separate user described outages lasting one or two days and said customer service quality was effectively a gamble. [r/indonesia ISP discussion](https://www.reddit.com/r/indonesia/comments/1imoi0s/what_internet_cable_provider_do_you_use/).

**Frequency and severity.** APJII’s 2025 penetration survey reported 80.66% internet penetration, or about 229 million people. A 2026 summary of APJII data reported that in early 2026, 29.5% of respondents experienced slow mobile networks and 29% weak signal in some locations; in 2025 the figures were 26.2% and 26.7%. [ANTARA on APJII 2025](https://www.antaranews.com/berita/5019229/apjii-catat-tingkat-penetrasi-internet-indonesia-capai-8066-persen); [Databoks, 3 Jun 2026](https://databoks.katadata.co.id/teknologi-telekomunikasi/statistik/6a1fa3823d439/gangguan-internet-utama-di-indonesia-jaringan-lambat-dan-sinyal-lemah).

**Last time faced, action, and cost.** The latest dated app incident was Jul 2025: the user restarted, reinstalled, and contacted social support. Forum users switched providers, used a sales contact, changed DNS, or stopped paying. Cost ranges from wasted support time and a monthly bill to missed WFH income; exact loss is unmeasured.

**Current workaround / competing product.** Users keep a mobile-data backup, use a neighbour’s connection, switch to Biznet/IndiHome/MyRepublic/other local providers, contact a sales representative instead of formal support, or escalate publicly on social media.

**Evidence judgment.** High for broad connectivity pain; medium for a paid “support layer.” The opportunity is not another speed-test dashboard. It is trustworthy incident management: detect regional versus household failure, preserve a ticket trail, show whether a promise was met, and automate a billing-adjustment claim.

### 7. Public transport does not solve the first/last mile or predictable travel time

**Target customer and situation.** A commuter in Jabodetabek, Bandung, Denpasar, Palembang, or Makassar wants to leave a private vehicle at home, but the trip involves an unsafe walk, multiple transfers, uncertain waits, or a cost that exceeds a motorcycle or ride-hailing alternative.

**Customer’s own words.** A public discussion in Apr 2025 said that full public-transport commuting was less practical and often less economical than a motorcycle; the user cited uncertainty about punctuality, availability, and the lack of pedestrian infrastructure. [r/indonesia, Apr 2025](https://www.reddit.com/r/indonesia/comments/1k3iz8q/jabodetabek_raya_komodos_yang_masih_menggunakan/).

The 2025 Indonesia Sustainable Mobility Outlook describes the barrier as “impracticality,” including multiple transfers, inadequate routes, infrequent service, unreliable schedules, and overcrowding. It reports that in Bandung the public-transport journey can take 2.2 times longer and cost 18% more than motorcycles or online ride-hailing. [IESR, Indonesia Sustainable Mobility Outlook 2025, pp. 25–26](https://iesr.or.id/wp-content/uploads/2025/07/Indonesia-Sustainable-Mobility-Outlook-2025-IESR-2.pdf).

**Frequency and severity.** This is a recurring daily problem, not a one-off service failure. Severity is medium–high: lost time, fatigue, unsafe walking, missed work, and higher travel costs accumulate every day.

**Last time faced, action, and cost.** In the cited discussion, the commuter chose a motorcycle because the total trip was faster and cheaper. The measured cost is the 2.2× time and 18% higher public-transport cost in Bandung; for other cities, the personal cost needs diary research.

**Current workaround / competing product.** Motorcycles, GoJek/Grab for first and last mile, informal angkot, private cars, and route combinations in Google Maps or the transit app. These workarounds fragment the trip and transfer coordination cost to the commuter.

**Evidence judgment.** High for the problem; medium for a standalone consumer product because infrastructure constraints matter. A viable prototype should start with one corridor and test a promise such as “reliable door-to-door arrival with one fallback,” not a generic route map.

### 8. Platform workers cannot predict net earnings or why algorithms penalize them

**Target customer and situation.** An ojol, courier, or home-service worker logs in for a day’s income. They need to know the net value of each order after fuel, rental, commission, and incentives; why orders are allocated; and how to appeal an unfair suspension.

**Customer’s own words.** In May 2025, an ojol representative told a DPR forum: “Bensin, bensin kami. Tenaga, tenaga kami. Risiko di jalan kami tanggung sendiri.” (The fuel is ours, the labour is ours, and we bear the road risk ourselves.) Another driver said that paid “slot” programmes left non-paying drivers “sepi dan anyep” (quiet and empty). [detikOto, 23 May 2025](https://oto.detik.com/berita/d-7927923/ojol-ngeluh-ke-dpr-upah-dibabat-aplikator-harus-bayar-biar-dapet-order).

An Oct 2025 reporting survey found average daily income of Rp112,250 for 20 online motorcycle drivers and Rp271,464 for 20 online taxi drivers; 60% worked 10–14 hours daily and 57.5% worked seven days a week. One interviewed driver said he worked 6 a.m. to 9 p.m. because “the car rental is not going to pay for itself.” [Pulitzer Center, 2025](https://pulitzercenter.org/stories/power-algorithms-online-ride-hailing-platforms).

**Frequency and severity.** Fairwork/CIPG interviewed 80 platform workers from Jan–Mar 2025 across ten platforms; no platform scored above 2/10 on its fair-work scale, and researchers reported longer hours, lower income, higher deductions, and stronger competition. [CIPG/Fairwork, 26 Sep 2025](https://cipg.or.id/blog_article/hasil-survei-pekerja-platform-terjebak-kondisi-kerja-yang-buruk/). A separate telephone survey of 1,052 active Jabodetabek drivers in Sep 2025 found that 82% preferred a 20% commission if it produced more orders, showing that the real need is predictable net income and protection, not simply the lowest commission. [Metro TV, 19 Sep 2025](https://www.metrotvnews.com/read/K5nC7BMA-mayoritas-driver-ojol-disebut-pilih-potongan-20-persen-dengan-keuntungan-lebih-banyak).

**Last time faced, action, and cost.** The latest evidence is Oct 2025. Workers drove longer, accepted or paid for priority schemes, multi-homed, and joined associations or demonstrations. Cost is explicit: low daily income, 10–14-hour days, seven-day workweeks, vehicle payments, fuel, accident risk, and loss of rest.

**Current workaround / competing product.** Drivers use multiple apps, chat groups, informal earnings calculators, selective order acceptance, paid slots, and collective action. Existing platforms own the data needed to explain the earnings.

**Evidence judgment.** High and interview-backed. The opportunity is a worker-controlled “net earnings and appeal” layer, but data access, platform terms, and retaliation risk are major feasibility constraints. Prototype observation should test whether a worker can calculate a day’s true net and decide safely whether to accept an order.

### 9. Housing buyers cannot verify delivery, title, developer accountability, or refunds

**Target customer and situation.** A buyer has paid a booking fee, instalments, or a mortgage for a house or apartment. Delivery is delayed, specifications change, title documents are incomplete, or the developer stops responding. The buyer needs evidence and a coordinated path across developer, bank, notary, regulator, and consumer bodies.

**Customer’s own words.** A legal consultation published 2 Apr 2026 described an apartment buyer whose cancellation and refund process had been stalled for more than a year; the user wrote that the money paid was very large and had already sought legal help. [BPHN consultation, 2 Apr 2026](https://literasihukum.bphn.go.id/konsultasi-hukum/28951).

**Frequency and severity.** BPKN reported 851 consumer complaints in 2025, with potential losses of Rp438.3 billion. Property represented about Rp402 billion of that potential loss, while total recovery was about Rp23 billion. [ANTARA on BPKN, 16 Dec 2025](https://www.antaranews.com/berita/5307586/bpkn-catat-851-aduan-konsumen-sepanjang-2025). In Mar 2025, BPKN said it had received 1,326 property complaints and that around 100,000 Meikarta consumers had been harmed, with about 13,000 cases resolved at that point. [detikProperti, 27 Mar 2025](https://www.detik.com/properti/berita/d-7844085/bpkn-ungkap-sederet-aduan-konsumen-perumahan-apa-yang-paling-banyak).

Severity is very high: the transaction is high value, recovery can take years, and the buyer may continue paying financing while lacking possession or title.

**Last time faced, action, and cost.** The latest cited individual case was Apr 2026: the buyer cancelled, pursued legal assistance, and waited more than a year. Cost was substantial locked capital and legal/admin time; the exact amount was not disclosed. Official data shows recovery is a small fraction of potential loss.

**Current workaround / competing product.** Buyers use lawyers, BPKN, YLKI, Ombudsman, BENAR-PKP, class actions, developer WhatsApp groups, and public pressure. Property portals help discovery but rarely provide post-purchase accountability.

**Evidence judgment.** High. A product should begin as a verification and case-management service, not a marketplace. Test whether a buyer can upload a PPJB, payment record, and promised handover date and receive a credible risk map plus an escalation plan.

### 10. Online job search consumes hours while listings are ghosted, mismatched, or fraudulent

**Target customer and situation.** A job seeker applies across LinkedIn, JobStreet, Indeed, Glints, and social media while unemployed or underpaid. They need to know whether a vacancy is real, whether the employer has reviewed the application, what the next step is, and whether the role is worth the application effort.

**Customer’s own words.** In an Aug 2025 Reddit post, an administrator with eight years’ experience said they had been actively searching since Apr 2025. Each Indeed application required re-entering data and took “20+ menit/lamaran” (20+ minutes per application). They had sent 100+ applications in four months, received zero interview calls, and saw “Employer viewed your profile” without follow-up. [Reddit, 4 Aug 2025](https://www.reddit.com/r/indonesia/comments/1mh94h9/butuh-insight-setahun-apply-kerja-nol-panggilan/).

**Frequency and severity.** Job fraud is measurable: a Dec 2025 parliamentary brief reported that from Jul 2024–Jun 2025, JobStreet rejected 3,600 company recruitment attempts that failed verification, closed 650 accounts for fraud risk, and removed 2,800 postings after investigation. [DPR RI brief, Dec 2025](https://berkas.dpr.go.id/pusaka/files/info_singkat/Info%20Singkat-XVII-24-II-P3DI-Desember-2025-576-EN.pdf). SMERU’s labor-market platform research describes application oversupply, ghost vacancies, and the resulting distortion of the job market. [SMERU](https://smeru.or.id/sites/default/files/publication/wp_employers_and_jobseekers_eng_2024-10-8.pdf).

Severity is high because the job seeker loses time when income is already constrained, may disclose identity documents to scammers, and may miss better opportunities while waiting.

**Last time faced, action, and cost.** The Aug 2025 seeker kept applying, optimized an ATS-friendly CV, used multiple platforms, and asked the community for strategy. The disclosed cost is at least 2,000 minutes (about 33 hours) for 100 applications at 20 minutes each, plus four months without an interview and no quantified income.

**Current workaround / competing product.** Applicants use referrals, LinkedIn networking, recruiter DMs, community groups, company career pages, CV services, and “apply to many” volume strategies. Employers use ATS systems and platform filters, which may intensify opacity.

**Evidence judgment.** Medium–high. The product opportunity is verified opportunity intelligence and application feedback, not another job board. Prototype success should be measured by whether users can decide “apply / ask a question / skip” in under two minutes and understand why a role is trusted or risky.

### 11. Informal social-commerce sellers operate through fragmented, manual workflows

**Target customer and situation.** A small seller closes sales through WhatsApp, Instagram, Facebook, TikTok, bank transfer, COD, QRIS, and marketplace channels. They track orders, payment, inventory, delivery, complaints, and refunds by chat, spreadsheet, notebook, and memory.

**Customer’s own words.** In a qualitative interview reported in the 2025 MicroSave/MSC study, a Denpasar seller said of WhatsApp Business: “I still have to process the transactions manually.” Another seller from Yogyakarta said they had received fake transfer receipts, so they now check their bank account and send a QR code as an image on WhatsApp. [MicroSave, *The landscape and financial access of social commerce sellers in Indonesia*, Sep 2025](https://www.microsave.net/wp-content/uploads/2025/09/Social-Commerce-Initiatives_Report_English.pdf).

**Frequency and severity.** The study covered 428 quantitative respondents and 30 qualitative interviews conducted Aug–Dec 2024. It found 79% recorded transactions, but only 7% used digital bookkeeping; COD and bank transfer dominated, while e-wallet and QRIS were available but less preferred. It also found manual after-sales processes created slower resolution, missed orders, delays, and refund disputes. This is strong evidence for a segment, though the sample is not a national census.

**Last time faced, action, and cost.** The latest published interview evidence is from the 2025 report. Sellers manually checked bank accounts, used COD, asked for deposits, replied via chat and social-media reviews, and handled returns without structured records. Cost is unquantified but operationally clear: missed orders, slower resolution, reputational damage, weak credit records, and limited working-capital access.

**Current workaround / competing product.** WhatsApp Business catalogues, spreadsheets, notebooks, marketplace seller centres, POS apps, bank statements, QRIS, COD, third-party logistics, and family assistance. Sellers often use several of these simultaneously rather than one system.

**Evidence judgment.** High for operational pain and workflow fragmentation. The opportunity is a lightweight, WhatsApp-first order-to-cash ledger with payment verification, inventory state, delivery status, and structured after-sales evidence. It must work without forcing a full e-commerce migration.

### 12. Indonesian SaaS builders face local-payment and billing integration friction

**Target customer and situation.** An Indonesian developer or startup launches a SaaS or AI product and needs subscriptions, usage-based billing, and local payment methods such as GoPay or other Indonesian rails. Global developer tools do not map cleanly to local payment methods, and custom billing consumes engineering time.

**Customer’s own words.** A Product Hunt launch for Eksekut, dated 2025, states the pain directly: “Can't use Stripe with GoPay? Building custom billing takes months?” The maker positioned the product as a drop-in billing layer for Indonesian developers. [Product Hunt, Eksekut, 2025](https://www.producthunt.com/products/eksekut/reviews).

Hacker News discussion of QRIS compared the Indonesian rail with Pix and highlighted its importance for small merchants and everyday transactions, but the thread is comparative rather than a 2025 Indonesian customer study. [Hacker News, 2026 discussion](https://news.ycombinator.com/item?id=48052371).

**Frequency and severity.** Frequency is unknown. Product Hunt provides one direct maker signal and no representative denominator; the evidence strength is therefore low–medium. Severity is medium for a startup: months of engineering, delayed launch, billing failure, or forced use of less suitable payment methods.

**Last time faced, action, and cost.** The latest direct signal is the 2025 launch itself. The stated workaround before Eksekut was custom billing; the stated cost was “months” of build time. No independent customer cohort or retention data was available in the public record reviewed.

**Current workaround / competing product.** Local payment gateways, custom API integrations, bank transfer, manual invoicing, GoPay/DANA/QRIS links, and global processors where available. Builders may also avoid recurring billing and use one-off payments.

**Evidence judgment.** Treat as an opportunity clue, not a validated market. Interview at least 15 Indonesian SaaS builders and ask for the last failed billing integration, exact engineering hours, payment mix, failed conversion, and current provider before building.

## Cross-problem patterns

### The repeated job is recovery, not discovery

Across shopping, payments, tax, healthcare, internet, property, and work, the user already found the service. The failure occurs after commitment: money has moved, a slot has vanished, a ticket is open, a document is submitted, or an algorithm has changed the outcome. This makes the most defensible product wedges evidence, status, escalation, and recovery.

### Support channels are plentiful but accountability is weak

Users are repeatedly told to clear cache, contact Instagram, email support, visit an office, or submit another report. These channels may be available, but they often do not preserve the whole incident or produce a single owner, deadline, and next action. A better workflow needs continuity across channels.

### Users pay with time when they cannot pay with money

The workaround is often waiting, retrying, arriving early, calling, switching providers, using a personal contact, or asking a community. The product opportunity should measure time saved and uncertainty removed, not only transaction volume.

### Feature requests are clues, not requirements

“Add a refund button,” “fix OTP,” “show the bus,” “give more orders,” and “make customer service better” each point to a deeper desired outcome. The deeper outcome should be tested through observed tasks: recover funds without retrying, get a trustworthy appointment, calculate net income, verify a job, or close a sale with a reliable record.

## Prioritized opportunity candidates

### A. Payment and scam recovery layer

**Why now.** The combination of e-wallet review failures, OJK complaint volume, IASC scale, and user stories of fragmented escalation is the strongest cross-source signal.

**Narrow first workflow.** A user pastes a transaction ID or uploads a screenshot. The system classifies the state as pending, failed, reversed, uncredited, unauthorized, or scam-suspected; warns against retrying; generates the exact evidence packet; routes the case to the correct provider; and tracks the deadline.

**Risks.** Financial advice, privacy, false confidence, and the possibility of impersonation. Start with a read-only assistant and verified links to official channels.

### B. Verified after-sales recovery for marketplaces and social sellers

**Why now.** Marketplace surveys show 91% experiencing a problem; social sellers face manual complaints, refund disputes, and poor records.

**Narrow first workflow.** A buyer or seller creates one case with order, payment, delivery, product condition, and chat evidence. The prototype recommends the next action, expected evidence, deadline, and escalation path. It should work for WhatsApp-originated transactions as well as marketplace orders.

**Risks.** Platform access, dispute neutrality, fraud, and the need to avoid taking legal positions. Start with evidence organization and deadline tracking.

### C. Net-income and appeal assistant for platform workers

**Why now.** Interview evidence shows low and unstable earnings, long workdays, paid priority schemes, and opaque algorithmic sanctions.

**Narrow first workflow.** A driver enters or imports one day’s orders, fuel, rental, commission, and incentives. The system shows net hourly income, identifies unprofitable patterns, and creates an appeal record when a suspension or payment change occurs.

**Risks.** Platform retaliation, incomplete data, and workers’ safety while using the tool. Test with a privacy-preserving diary and manual entry before requesting platform integrations.

## Prototype and observation plan

The research record does not contain a completed prototype test. The next step should be observed task completion with real target users, not a feature-preference survey.

| Prototype | Participants | Scenario | Observe | Minimum signal |
|---|---|---|---|---|
| Payment/scam recovery | 5 consumers who recently had a failed or suspicious transfer | “You see money deducted but the recipient has not received it. What do you do?” | Whether they classify state correctly, avoid retrying, find the official escalation, and understand what evidence is needed | 4/5 complete without facilitator rescue; no unsafe action |
| Marketplace after-sales | 5 buyers and 5 social sellers | “The item is late/damaged and support has not resolved it. Start a case.” | Where they look for order proof, whether they trust the evidence packet, and whether buyer and seller understand the same status | 8/10 complete in under five minutes; users can state next deadline |
| Driver net-income | 5 ojol or courier workers | “Review yesterday’s shift and decide whether to accept a similar order today.” | Ability to enter costs, interpret net hourly income, and explain a decision | 4/5 make the same decision they would make with their own records; no confusion about gross vs net |

For each session, ask:

- “When did this last happen?”
- “What did you do next, in order?”
- “What did it cost in money, time, income, or stress?”
- “What would make you distrust this workflow?”

Do not ask whether users like a feature. Observe whether they can understand the state, complete the workflow, and recover from an error. Record pauses, wrong turns, workarounds, and moments when the prototype’s recommendation conflicts with the user’s real-world knowledge.

## Expanded problem cards: additional 2025–2026 signals

The following cards add distinct problems found in the second research pass. They are intentionally separated from the first twelve so that overlapping symptoms—such as “bad support”—remain tied to a specific customer job and context.

### 13. Public-service workflows are so opaque that people pay brokers to bypass them

**Target customer and situation.** A resident needs a permit, document, passport, vehicle service, or other government transaction and cannot tell what is missing, who owns the next step, or when the process will finish.

**Customer’s own words.** A March 2025 Reddit post described government workflows as “tidak efisien, lambat dan berbelit, a.k.a. ‘not user friendly’” and said this creates room for people offering a “bypass system.” Another commenter described a renovation permit: “6bulan bolak-balik upload document tapi ga beres dan selalu di reject dengan bermacam alasan.”

**Frequency and severity.** The signal is repeated across the thread, including passport applicants who found online appointments full for a month. Frequency is not population-measured. Severity is high when the delay blocks construction, travel, a licence, or income; the hidden cost is the temptation to pay a broker or make repeated office visits.

**Last time faced, action, and cost.** The latest observed incident was the March 2025 discussion. The resident repeatedly uploaded documents and received changing rejection reasons; the stated cost was six months of delay plus taxes and a possible broker fee. Workarounds are brokers, in-person escalation, repeated uploads, and asking contacts inside the agency.

**Evidence.** Medium: multiple first-person accounts in a dated public forum, but no representative denominator. [Reddit discussion, 8 Mar 2025](https://www.reddit.com/r/indonesia/comments/1j6uaq2/mengapa_kebanyakan_sistem_pelayanan_public/).

### 14. Super-app expansion makes basic tasks harder to find and complete

**Target customer and situation.** A frequent user wants one simple action—view transaction history, change a payment method, search for a product, or buy a mobile package—but the app is crowded with promotions, unrelated services, changing navigation, and default options.

**Customer’s own words.** A February 2025 Reddit discussion described Livin’ as difficult for “cari history transaksi,” Tokopedia’s payment defaults as intrusive, and MyTelkomsel as “laggy and a messy clusterfuck.” Another user said the search experience had degraded because an exclusion operator that previously removed misleading listings no longer worked.

**Frequency and severity.** This is repeated qualitative evidence across several major Indonesian apps, not a prevalence estimate. Severity is usually medium, but rises to high when a user is trying to pay, cancel, or avoid a wrong purchase under time pressure.

**Last time faced, action, and cost.** The latest incident in the evidence is February 2025. Users dug through “view more” menus, switched to another app, or used an ATM/browser. Cost is recurring time and higher risk of accidental payment, unwanted add-ons, or buying the wrong product.

**Evidence.** Medium: multiple user accounts and concrete task failures, without a controlled usability benchmark. [Reddit discussion, 8 Feb 2025](https://www.reddit.com/r/indonesia/comments/1ikakav/why-did-indonesian-app-developers-follow-chinese-app-design-mindset/).

### 15. Digital identity is not fully digital: activation and recovery still require offices

**Target customer and situation.** A citizen needs to activate IKD, update an identity document, or use a digital document remotely, but the workflow still requires a QR code, officer verification, a specific device state, or a visit to Dukcapil.

**Customer’s own words.** A February 2025 user trying to replace a damaged e-KTP wrote that the final submission required IKD activation first, then required generating a QR code “yang nanti discan petugas di Disdukcapil (wtf again).” The official Tegal Dukcapil notice said a January 2025 update was intended to fix installation difficulties; a February 2025 news report clarified that activation remained offline at a Dukcapil office.

**Frequency and severity.** The problem is evidenced by an official update plus repeated user questions and complaints. Severity is high for people working or living away from their registered address, and for citizens who lose the physical document and discover the digital fallback is not self-serve.

**Last time faced, action, and cost.** The latest incident in the research record is a February 2026 Reddit question about whether deleting the app would force another office visit. The workaround is to keep the app and PIN, return to Dukcapil, or request a temporary replacement letter. Cost is travel, queue time, and exposure to identity-phishing messages.

**Evidence.** High for workflow friction; medium for prevalence. [Dukcapil Tegal update, 13 Jan 2025](https://disdukcapil.tegalkab.go.id/berita/280-kemendagri-rilis-update-aplikasi-ktp-digital-di-playstore), [Kompas, 23 Feb 2025](https://amp.kompas.com/tren/read/2025/02/23/153000165/bikin-ktp-digital-atau-ikd-masih-offline-di-kantor-dukcapil-ini-kata-ditjen), [Reddit, 10 Feb 2026](https://www.reddit.com/r/indonesia/comments/1r0s93s/ask_komodo_ada_yang_udah_instal_urus_aktivasi/).

### 16. Utility complaints can be marked closed or cancelled while the underlying problem remains

**Target customer and situation.** A household submits a power, meter, name-transfer, or new-connection complaint through PLN Mobile and expects a ticket with a truthful status and an offline fallback.

**Customer’s own words.** A July 2026 PLN Mobile review said: “both of my complaints were automatically marked ‘Cancelled by Customer’ even though I never cancelled them.” The same reviewer uploaded documents but was still required to submit physical copies and verify offline. In a July 2025 Reddit post, a customer wrote that two complaints were never processed and, after about a week, were treated as completed.

**Frequency and severity.** The app has 1.61 million reviews, but the cited reviews cannot establish incidence. Severity is high when the complaint concerns a new connection, meter fault, payment, or EV charging; false closure destroys the customer’s ability to know whether to wait or escalate.

**Last time faced, action, and cost.** The latest incident was July 2026. The customer recontacted PLN through live chat after seeing an incorrect status; cost was the unquantified delay, document duplication, and potential payment or service interruption. Workarounds are phone 123, social media, a local office, or repeated ticket submission.

**Evidence.** Medium–high: direct review plus official reply and a separate 2025 first-person account. [PLN Mobile Google Play reviews](https://play.google.com/store/apps/details?id=com.icon.pln123), [Reddit complaint, 8 Jul 2025](https://www.reddit.com/r/WkwkwkLand/comments/1luks9y/customer_service_pln/).

### 17. Water outages have no reliable status or escalation path

**Target customer and situation.** A household, guesthouse, or small business loses piped water and cannot see a restoration estimate or get a meaningful response from the utility.

**Customer’s own words.** A July 2026 Bali resident wrote: “PDAM water service has been off for 2 weeks and I am getting nothing but run around from the office.”

**Frequency and severity.** This is an anecdotal signal, but the severity is high for sanitation, hospitality, food preparation, and households with children or elderly people. Two weeks without water makes a generic call centre answer operationally useless.

**Last time faced, action, and cost.** The latest incident was July 2026. The resident contacted the office repeatedly and was redirected without resolution. Cost was at least two weeks of disruption and likely purchased water or alternative bathing and cleaning arrangements; the amount was not disclosed. Workarounds include bottled water, private tanks, neighbours, and repeated in-person visits.

**Evidence.** Low–medium: one dated public report, useful for discovery but not prevalence. [Reddit r/bali, 13 Jul 2026](https://www.reddit.com/r/bali/comments/1uuyu73/pdam_water_has_been_off_for_2_weeks/).

### 18. Parcel tracking stalls at transit points and support cannot resolve the exception

**Target customer and situation.** A buyer or seller needs to know whether a parcel is moving, lost, damaged, or delivered to the wrong place, but the tracking page remains unchanged and support replies with a bot or generic ticket.

**Customer’s own words.** A 2025 content analysis of 100 negative J&T Express app reviews found the leading complaint category was reliability: “paket stagnan di titik transit dan keterlambatan last-mile delivery.” Another recurring customer description from courier reviews was “status parcel gak jelas keberadaannya” after a week-long delivery and unclear damage investigation.

**Frequency and severity.** In the 100-review sample, 46.61% of coded complaints were reliability, 32.20% support responsiveness, and 20.33% technology-system failures. The sample is not representative, but the pattern is operationally specific. Severity is high for sellers whose marketplace SLA or refund window is expiring, and for medicine, documents, or time-sensitive goods.

**Last time faced, action, and cost.** The study’s latest review window ended in November 2025. Customers waited, opened a ticket, called support, or switched couriers; cost was delayed delivery, lost sales, and a refund or compensation claim. [J&T Express review analysis, published 2026](https://journal.ilmudata.co.id/index.php/RIGGS/article/view/4477).

**Evidence.** High for the observed complaint pattern; medium for population prevalence.

### 19. Courier-merchant apps fail at the exact moment of label, COD, or QRIS payment

**Target customer and situation.** A small seller or courier uses PosAja to create a shipment, enter a COD customer, or pay with QRIS, but the app logs out, rejects the account, or loses the transaction state.

**Customer’s own words.** An August 2025 review said the app lost punctuation in text fields and logged out when the user tried to display QRIS; the reviewer had already called customer service. A July 2026 review described failed COD entry, forced “update” messages despite being fully updated, reinstall failure, and an account recovery loop: “no tlp dan email tidak dikenal.”

**Frequency and severity.** The app has about 19,000 reviews, while the cited cases are anecdotal. Severity is high for a merchant because a failed label or COD entry blocks a shipment and can make the seller look unreliable to a customer.

**Last time faced, action, and cost.** The latest observed incident was July 2026. The seller tried updating, uninstalling, reinstalling, and calling customer service. Cost was a lost shipment opportunity and time spent recovering the account; no amount was disclosed. Workarounds are another courier app, a branch, or manual shipment creation.

**Evidence.** Medium: direct app reviews with developer support responses. [PosAja Google Play](https://play.google.com/store/apps/details?hl=id&id=com.posindonesia.cob).

### 20. Travel booking is stressful because price, availability, and support change during the transaction

**Target customer and situation.** An Indonesian traveler books a flight, hotel, or package under a budget and deadline, then sees the price rise, payment options change, or the booked room disappear when the trip is already underway.

**Customer’s own words.** YouGov reported in February 2025 that 54% of Indonesian vacation bookers found the booking experience stress-inducing. A May 2026 Traveloka review said the displayed ticket price moved from roughly Rp1.3 million to Rp1.9 million after clicking. Another wrote that a room shown as available was full after payment: “dana pembayaran sudah lunas semua.” A Trustpilot reviewer dealing with an airport closure said the app showed a changeable hotel policy but the booking behaved as non-refundable and the listed phone numbers were inactive.

**Frequency and severity.** The 54% survey signal is broad; app reviews show distinct failure modes. Severity is high because the customer may be stranded, forced to rebook at night, or unable to recover a paid booking.

**Last time faced, action, and cost.** The latest app incidents were May–September 2026. Travelers contacted the hotel, emailed or chatted with the OTA, and sometimes booked again elsewhere. One 2026 review reported losing Rp350,000 and receiving only a Rp20,000 voucher after a room was unusable. Workarounds include checking directly with the hotel, comparing Agoda, tiket.com, Booking.com, or calling the property before travel.

**Evidence.** High for booking stress; medium for specific failure prevalence. [YouGov, 25 Feb 2025](https://yougov.com/reports/51563-id-travel-stress-report-2025), [Traveloka Google Play reviews](https://play.google.com/store/apps/details/Traveloka_Hotel_Flight?hl=id&id=com.traveloka.android), [Trustpilot Traveloka reviews](https://www.trustpilot.com/review/traveloka.co.id).

### 21. Train-ticket payment verification and refunds are hard to understand

**Target customer and situation.** A passenger buys or cancels a KAI ticket through Access by KAI, but payment verification, seat state, or refund timing is unclear.

**Customer’s own words.** A March 2026 passenger asking about a cancellation wrote: “Would it be better to go to the train station that night to process the refund, or do it the next morning before 8am?” A 2025 text-mining study of Access by KAI complaints identified delayed payment verification as one of four dominant complaint topics.

**Frequency and severity.** The study indicates a recurring complaint theme, but does not provide a user denominator. Severity is high near departure because a passenger cannot safely retry payment or assume a refund is in progress.

**Last time faced, action, and cost.** The latest public incident was March 2026. The passenger considered going to the station for help rather than trusting the app. Cost was travel to the station, uncertainty about the ticket, and the risk of buying a duplicate seat. Workarounds are station counters, screenshots, bank confirmation, or booking through another channel.

**Evidence.** Medium: published complaint analysis plus a dated passenger question. [Access by KAI complaint analysis, 2026](https://journal.darmajaya.ac.id/index.php/SIMADA/article/view/1339), [Reddit r/Jakarta, 30 Mar 2026](https://www.reddit.com/r/Jakarta/comments/1s7pul0/questions_about_kai_refund_safety_at_night_running/).

### 22. Food delivery hides driver scarcity until the customer has lost the meal window

**Target customer and situation.** A customer orders food during a busy period or late at night, receives reassuring status notifications, and waits while the platform searches for a driver without revealing the real exception.

**Customer’s own words.** A September 2025 Gojek review said: “after waiting more than an hour… 2 hours later I had no food,” and the restaurant later said there was no driver and it was closing. The reviewer said they had no way to know the real situation. The developer replied that driver scarcity could be caused by peak demand or a lack of nearby drivers.

**Frequency and severity.** One review is not prevalence, but the support explanation confirms the underlying operational condition. Severity is medium for routine meals and high when a person is sick, caring for a child, fasting, or ordering after restaurants have closed.

**Last time faced, action, and cost.** The latest incident was September 2025. The customer waited, contacted the restaurant, then considered Grab. Cost was two hours, a missed meal, and loss of alternatives. Workarounds are switching platforms, calling the restaurant directly, or ordering pickup.

**Evidence.** Medium: dated app review plus developer response. [Gojek App Store reviews](https://apps.apple.com/us/app/gojek/id944875099?see-all=reviews).

### 23. Mobile-data purchases can be paid but not delivered

**Target customer and situation.** A prepaid mobile user urgently buys a data package through a provider app and a wallet, but payment succeeds while the quota remains absent or delayed.

**Customer’s own words.** A July 2025 Reddit post described paying Rp75,000 for Tri through Bima+ using DANA, then wrote that the quota “gak masuk-masuk.” Another commenter said their package had previously taken about an hour to arrive after a system error.

**Frequency and severity.** This is a repeated anecdotal pattern across provider apps, but not a measured rate. Severity is high when the customer needs connectivity for work, authentication, navigation, or an emergency and has already spent the available balance.

**Last time faced, action, and cost.** The latest incident was July 2025. The user waited, tried another purchase channel, and compared provider apps. Cost was Rp75,000 plus lost connectivity and the risk of double-paying. Workarounds are USSD, a retail outlet, a different bank or wallet, or the provider’s web portal.

**Evidence.** Medium–low: direct dated user report with corroborating comments. [Reddit r/indonesia, 26 Jul 2025](https://www.reddit.com/r/indonesia/comments/1m9r5mig/kalian_ada_masalah_gak_sama_aplikasi_provider_indo/).

### 24. Cross-provider payment disputes send the customer in a loop

**Target customer and situation.** A consumer loads Flazz, buys a telco package, or pays a merchant through one app using another bank or wallet; each provider can see only one side and sends the customer back to the other.

**Customer’s own words.** A March 2025 user wrote: “uang saya nyangkut 400.000 rupiah,” after a failed Flazz top-up. GoPay sent them to BCA, BCA sent them back to GoPay, and the user described being “dibuat pingpong.” GoPay then required a screenshot from MyBCA, forcing the user to download another app solely to prove the transaction.

**Frequency and severity.** The case is anecdotal, but it exposes a structural problem in multi-party payments. Severity is high when the amount is meaningful to the household and the customer must collect evidence from systems they do not normally use.

**Last time faced, action, and cost.** The latest incident was March 2025. The customer called both providers, downloaded MyBCA, resubmitted screenshots, and waited three days or more. Cost was Rp400,000 temporarily inaccessible, a new app download, multiple calls, and several days of effort.

**Evidence.** Medium: detailed first-person support journey with concrete money and time cost. [Reddit r/indonesia, 13 Mar 2025](https://www.reddit.com/r/indonesia/comments/1jagh10/pengalaman_lapor_masalah_flazz_di_gopay/).

### 25. Banking apps fail on login and QRIS when the user needs them most

**Target customer and situation.** A bank customer needs to log in, pay a bill, or scan QRIS during a busy period, but the app blocks access, formats the amount incorrectly, or crashes while another bank app works.

**Customer’s own words.** An October 2025 BCA Mobile review said QRIS input was still broken and turned Rp5,000 into “5 000.” A 2026 Reddit discussion described Permata as slow and sometimes leaving a transfer at zero until the next business day. A MyBCA review said the app could not be opened even though other BCA services worked.

**Frequency and severity.** App-store reviews and forums provide repeated signals, not a clean incidence rate. Severity is high for time-sensitive purchases, rent, payroll, or a merchant who cannot afford to lose a sale.

**Last time faced, action, and cost.** The latest evidence is May–August 2026. Users retried, waited for the bank, used another bank, or paid cash. Cost ranges from failed transactions to a weekend delay and lost trust; amounts were not disclosed.

**Evidence.** Medium. [BCA Mobile Google Play review](https://play.google.com/store/apps/details?hl=fr&id=com.bca), [Reddit banking-app discussion, May 2026](https://www.reddit.com/r/indonesia/comments/1tk1y03/removed/).

### 26. Illegal lending and debt collection turn a short-term cash problem into a privacy and safety crisis

**Target customer and situation.** A borrower takes a fast loan during an income shock, then faces opaque costs, aggressive collection, contact-list exposure, or a demand to pay before the agreed due date.

**Customer’s own words.** A September 2025 Reddit account described a Rp300,000 loan and an early demand: “harus bayar hari ini jam 9, kalo nggak data gw disebar.” The Jakarta Post reported that 55% of P2P-lending complaints involved debt-collection misconduct, followed by requests for repayment relief and default handling.

**Frequency and severity.** OJK reported 7,096 complaints about illegal online lending in the first half of 2025 and identified 1,556 illegal lending entities; it also requested blocking of 2,422 debt-collector numbers. Severity is very high because harm can include harassment, damaged relationships, blackmail, and loss of future credit access.

**Last time faced, action, and cost.** The latest incident in the evidence is August–September 2025. The borrower sought advice online, considered ignoring illegal collectors, and tried to distinguish legal from illegal lenders. Cost was the loan principal plus high interest, stress, risk to personal contacts, and potential credit damage.

**Evidence.** High: official enforcement and complaint data combined with a first-person account. [OJK, June 2025](https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/RDKB-Juni-2025.aspx), [Jakarta Post, 9 Feb 2025](https://www.thejakartapost.com/business/2025/02/09/fraud-and-other-risks-still-holding-back-p2p-lending-business), [Reddit, 9 Aug 2025](https://www.reddit.com/r/indonesia/comments/1mlciw8/im_really_scared_because_my_parents_heavily_pressured_me_to_use_pinjol/).

### 27. BNPL and digital-credit users cannot easily see the full repayment risk

**Target customer and situation.** A consumer accepts paylater at checkout because the first payment looks manageable, then discovers that the schedule, fees, credit-record impact, or overlapping loans are harder to reason about than the purchase itself.

**Customer’s own words.** A 2025 policy analysis reported that Indonesian users were adopting more financial services without always understanding “the structure of costs and risks” attached to them. A Traveloka review in April 2026 complained that payment choices kept returning to PayLater and described the interest as high.

**Frequency and severity.** OJK reported BNPL financing of Rp7.12 trillion in January 2025, up 41.9% year over year, with gross NPF of 3.37%. The scale shows material exposure; it does not prove that every user is confused. Severity is high when several instalments land in the same pay cycle or late payment affects access to housing or vehicle credit.

**Last time faced, action, and cost.** The latest incident was the April 2026 Traveloka review. The customer tried to select another payment method and concluded that the product was steering them toward debt. Cost is the interest and fees, possible credit-record damage, and reduced future borrowing capacity; individual amounts were not disclosed.

**Evidence.** Medium–high: official balance-sheet signal plus user language, but individual repayment outcomes need interviews. [OJK BNPL data, Feb 2025](https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/RDKB-Februari-2025.aspx), [Katadata/CELIOS analysis, Dec 2025](https://katadata.co.id/digital/fintech/694220c548ab3/tadpole-menggerus-pelindungan-konsumen), [Traveloka review](https://play.google.com/store/apps/details/Traveloka_Hotel_Flight?hl=id&id=com.traveloka.android).

### 28. Marketplace buyers cannot reliably distinguish legal and safe products

**Target customer and situation.** A consumer buys cosmetics, supplements, traditional medicine, or other health-related products through a marketplace or social account and cannot tell whether the product is registered, authentic, or advertised lawfully.

**Customer’s own words.** The 2025 marketplace survey recorded counterfeit concerns among shoppers. BPOM’s Serang cyber patrol found 123 violations in January–June 2025: 109 products had no distribution permit, alongside products containing dangerous ingredients and advertising violations. The official categories—“tanpa izin edar” and “bahan berbahaya”—describe the risk customers are trying to avoid, even though the enforcement release contains no individual buyer quote.

**Frequency and severity.** The 123 cases are a local enforcement sample, not a national rate. Severity is high because harm can be medical, not merely financial; a refund may not reverse exposure to an unsafe product.

**Last time faced, action, and cost.** The latest official evidence is the third-quarter 2025 monitoring cycle. Consumers’ workarounds are checking BPOM numbers, buying from official stores, asking in social groups, or avoiding online purchases. Cost is the product price, possible treatment, and time spent verifying authenticity.

**Evidence.** Medium–high for the existence of the problem; medium for national prevalence. [BBPOM Serang, 8 Jul 2025](https://serang.pom.go.id/berita/semester-i-2025-bbpom-serang-temukan-123-produk-ilegal-di-platform-online), [BPOM marketplace monitoring, Q3 2025](https://siber.pom.go.id/berita/bpom-berkoordinasi-dengan-idea-dan-marketplace-melaksanakan-monitoring-dan-evaluasi-patroli-siber-triwulan-iii-2025).

### 29. Families face opaque school charges while social-assistance payments arrive late

**Target customer and situation.** A parent registers or re-registers a child at a public school, is asked for committee or development money, and cannot predict whether a promised support payment such as PIP will arrive before the invoice.

**Customer’s own words.** A 2025 local report summarized residents’ frustration as schools still asking families to “bayar, bayar, bayar.” A widely discussed case described a child being made to sit on the floor after three months of unpaid fees totaling Rp180,000 while PIP funds had not yet been disbursed. Ombudsman reports and warnings in 2025–26 documented complaints about unregulated school charges.

**Frequency and severity.** Ombudsman recorded 13 reports involving alleged school or madrasah levies in 2025; this is an administrative count, not the total experience. Severity is high because the consequence can be stigma or exclusion for a child, not simply an unexpected bill.

**Last time faced, action, and cost.** The latest evidence is from 2026 reporting on 2025 cases. Families delayed payment, appealed to the school or Ombudsman, borrowed, or waited for PIP. The disclosed cost in the cited case was Rp180,000 plus humiliation and missed support.

**Evidence.** Medium–high: official complaint count plus a named media case, with local variation. [Ombudsman, 6 Aug 2026](https://ombudsman.go.id/artikel/r/artikel--pungutan-bukan-solusi-pembangunan-di-dunia-pendidikan), [Ombudsman SPMB warning, 2025](https://ombudsman.go.id/pers/r/awasi-spmb-ombudsman-ingatkan-pungutan-di-luar-ketentuan-harus-dikembalikan), [local report, 17 Apr 2025](https://bojonegoro.inews.id/read/583533/bojonegoro-daerah-kaya-tapi-warga-mengeluh-sekolah-masih-bayar-bayar).

### 30. Affordable daycare is too far away, too full, or too difficult to verify

**Target customer and situation.** A working parent needs dependable daytime care but cannot find a public or affordable facility near home or work with transparent capacity, quality, safety, and hours.

**Customer’s own words.** A February 2026 Reddit post summarized the search for government daycare in Jakarta as “jauh dari rumah, fasilitas terbatas, kuota tak selalu ada” and linked the problem to the quality of life of working mothers.

**Frequency and severity.** A 2025 care-economy report says Indonesia lacks sufficient qualified training and capacity in childcare and aged care, and that families consequently rely on domestic workers. A World Bank care-economy study cited mothers spending 13.7 hours per day on childcare versus 3.8 hours for fathers. Severity is high because the workaround is dropping work, paying for private care, or relying on grandparents who may be unable to cope.

**Last time faced, action, and cost.** The latest first-person report is February 2026. Parents searched government facilities, compared distance and slots, and used relatives or private carers when no place was available. Cost is lost work time, private-care fees, commuting, and caregiver exhaustion; no single household amount was disclosed.

**Evidence.** Medium–high: direct parent report plus care-economy evidence; local supply needs mapping. [Reddit r/indonesia, 24 Feb 2026](https://www.reddit.com/r/indonesia/comments/1rd5d45/mencari_daycare_layak_milik_pemerintah_di_jakarta/), [Investing in Women, Care Economy in Indonesia, Mar 2025](https://investinginwomen.asia/wp-content/uploads/2025/03/Investing-in-Women-The-Care-Economy-in-Indonesia-March-2025_final.pdf).

### 31. Residents can see air pollution but cannot turn it into a trusted daily decision

**Target customer and situation.** A Jakarta or Java resident needs to decide whether to commute, exercise outdoors, send a child to school, or seek care, but pollution readings, causes, and recommended actions are inconsistent or not trusted.

**Customer’s own words.** An ETH Zurich survey of 3,400 Jakarta residents in February–March 2025 examined what residents believed and wanted authorities to do. A July 2026 Reddit thread began, “What’s up with the air here?” and described industrial pollution, heavy traffic, and household garbage burning.

**Frequency and severity.** The 3,400-person survey shows the problem is broadly salient, while the Reddit discussion shows ongoing lived experience. Severity is medium for routine exposure and high for children, asthma sufferers, outdoor workers, and people who cannot avoid commuting.

**Last time faced, action, and cost.** The latest public discussion was July 2026. Residents checked Windy or IQAir, watched weather, reduced outdoor activity, used masks, or complained on social media. Cost is recurring health risk, protective equipment, missed exercise, and uncertainty; the cited sources do not quantify household spend.

**Evidence.** Medium–high for salience, medium for a product opportunity. [ETH Zurich Jakarta air survey, 2025](https://ib.ethz.ch/research/current-projects/air-pollution/what-people-think/jakarta.html), [Reddit r/indonesia, 11 Jul 2026](https://www.reddit.com/r/indonesia/comments/1utwu6j/whats_up_with_the_air_here/).

### 32. Waste, flooding, and lack of green space remain visible problems without dependable local resolution

**Target customer and situation.** A resident sees uncollected waste, flooding, polluted water, or inadequate public space and cannot tell which agency owns the problem or whether a complaint will change the physical condition.

**Customer’s own words.** In a May 2025 National Kawula Survey, the most urgent environmental issues were described as inefficient waste management (42%), flooding (41%), lack of green open space (27%), and water and air pollution (27%). The previous quarter’s top concerns were flooding/drought (58%), inefficient waste management (57%), and water pollution (33%).

**Frequency and severity.** These are survey priorities rather than app incidents. The repeated high ranking across quarters indicates broad concern. Severity is high when flooding damages homes, blocks work, spreads disease, or makes waste collection unsafe.

**Last time faced, action, and cost.** The latest measured period was 12–15 May 2025. Residents relied on neighbourhood groups, private collection, sandbags, pumps, bottled water, or informal escalation. Cost includes cleanup, damaged goods, missed work, and private waste fees; the survey did not quantify it.

**Evidence.** Medium–high for public priority; low for a specific digital intervention. [Databoks/PP17, 16 Jun 2025](https://databoks.katadata.co.id/lingkungan/statistik/6848f71c7388a/daftar-masalah-lingkungan-yang-jadi-prioritas-warga-indonesia-kuartal-ii-2025).

### 33. Farmers cannot predict commodity income or the compliance risk attached to their land

**Target customer and situation.** A smallholder harvests a commodity such as palm oil and must decide labour, inputs, debt, and whether to keep planting while prices fluctuate and land enforcement changes.

**Customer’s own words.** In June 2025, Apkasindo described the problem as a “tekanan ganda” from fluctuating fresh-fruit-bunch prices and uncertainty created by forest-area enforcement. Its representative said: “Ketidakpastian sosial-ekonomi akibat harga CPO yang sangat fluktuatif, membuat petani ragu terkait sektor sawit.”

**Frequency and severity.** This affects a large commodity chain, but the cited source does not provide a farmer-level prevalence rate. Severity is high because decisions are seasonal and hard to reverse; a bad price or land status can erase months of work and jeopardize household income.

**Last time faced, action, and cost.** The latest public evidence is June 2025. Farmers monitored CPO and local TBS prices, relied on associations or buyers, delayed investment, or diversified where possible. Cost is price loss, stranded inputs, legal uncertainty, and foregone planting; the source gives no typical rupiah amount.

**Evidence.** Medium: sector association statement and a 2025 food-price study, but more farmer interviews are needed. [Bisnis.com, 24 Jun 2025](https://ekonomi.bisnis.com/read/20250624/12/1887792/petani-keluhkan-ketidakpastian-harga-sawit-dan-penertiban-lahan), [East Java farmer-welfare study, 15 Jan 2025](https://arxiv.org/abs/2501.08601).

### 34. Micro-merchants adopt digital payments without getting the operational layer around them

**Target customer and situation.** A warung or culinary microbusiness accepts QRIS or e-wallet payments but still records sales manually, cannot reconcile refunds, and does not know whether fees, device issues, or customer behaviour make the channel worthwhile.

**Customer’s own words.** A 2025 study on South Jakarta micro-merchants concluded that reluctance persisted because owners needed more education and operational training, not merely access to the payment instrument. A 2026 study of 237 Indonesian culinary MSMEs examined why sellers consider switching from cash to QRIS; it found that perceived value and attitudes toward QRIS were important push/pull factors.

**Frequency and severity.** The research uses mixed methods and a 237-response sample, but does not imply national prevalence. Severity is medium–high: reconciliation errors and fees accumulate daily, and the owner may lose the ability to see true margin or prove a disputed payment.

**Last time faced, action, and cost.** The latest evidence is the 2026 culinary-MSME study. Sellers compare providers, keep cash as a fallback, use multiple QRIS/acquirer accounts, or write transactions in notebooks. Cost is staff time, mistakes, cash-handling risk, and possible payment fees; not quantified.

**Evidence.** Medium: interview/survey-backed adoption friction, with an opportunity for reconciliation and merchant education rather than another QR code. [Social Sciences & Humanities Open, 2026](https://doi.org/10.1016/j.ssaho.2026.102691), [South Jakarta micro-merchant study, 14 Apr 2025](https://jurnal.unived.ac.id/index.php/er/article/view/7190).

### 35. B2B sellers cannot tell whether to extend credit in an unpredictable payment environment

**Target customer and situation.** A small or mid-sized supplier must decide whether to accept purchase orders on credit while customers’ cash flow, insolvency risk, and payment timing become less predictable.

**Customer’s own words.** Atradius’ 2025 Indonesia survey reported that 50% of companies expected B2B customer insolvencies to rise and described “widespread anxiety about greater operational challenges and a more unpredictable market environment.”

**Frequency and severity.** The 50% expectation is a measured business signal, though it is not a count of actual defaults. Severity is high for suppliers with thin working capital: one unpaid invoice can delay wages, inventory purchases, or tax payments.

**Last time faced, action, and cost.** The latest survey was published in 2025. Businesses tightened credit, kept existing payment policies, demanded deposits, or refused marginal customers. Cost is lost sales when refusing credit, financing cost when accepting it, and bad-debt exposure when payment fails.

**Evidence.** Medium: business survey rather than customer interview. [Atradius, B2B payment practices trends in Indonesia 2025](https://group.atradius.com/knowledge-and-research/reports/b2b-payment-practices-trends-indonesia-2025).

### 36. Layoffs and job insecurity push people into work that is easier to enter but harder to sustain

**Target customer and situation.** A formal worker loses a job or fears a layoff and must quickly find income, but job listings are unreliable and informal or gig work has unstable pay and no clear progression.

**Customer’s own words.** A June–July 2025 GoodStats survey and FGD were summarized as “badai PHK” with 67% of respondents affected or exposed. Ipsos’ H1 2025 Indonesia report identified layoffs and job insecurity as dominant public concerns. The transition often leads to gig work, where the earlier Fairwork interviews found longer hours, lower pay, and higher deductions.

**Frequency and severity.** The survey signals broad anxiety but does not establish that 67% were personally laid off; that distinction matters. Severity is high because a lost formal job can remove health, pension, and severance protections.

**Last time faced, action, and cost.** The latest public evidence is the 2025 survey period. People applied to jobs, accepted gig work, borrowed, or relied on family. Cost is lost income, job-search time, and a downgrade into riskier work; exact individual costs are not disclosed.

**Evidence.** Medium: survey and public-conversation evidence, strengthened by worker interviews elsewhere in this report. [GoodStats, 2025 survey](https://data.goodstats.id/statistic/badai-phk-pada-2025-67-publik-jadi-korbannya-XVhlQ), [Ipsos, What Worries Indonesia H1 2025](https://www.ipsos.com/sites/default/files/ct/news/documents/2025-10/WHAT%20WORRIES%20INDONESIA_H1%202025.pdf).

### 37. Creators cannot predict income when algorithms, monetization, or platform rules change

**Target customer and situation.** An Indonesian YouTuber, TikTok creator, or cross-platform publisher invests in content and sponsorships but cannot forecast reach, AdSense, revenue share, copyright exposure, or the effect of a platform policy change.

**Customer’s own words.** A 2025 Indonesian creator discussion was framed as “YouTuber di RI makin susah, pendapatan turun drastis.” The reporting around the discussion said creators increasingly depend on brand deals when direct platform revenue is unreliable. In 2026, Indonesia was reported to have a large share of Facebook monetized accounts, while creators still worried about copied content and algorithm effects.

**Frequency and severity.** The evidence is public-conversation and platform reporting, not a representative income panel. Severity is high for creators who have made content work their primary income; a reach or monetization change can remove revenue without a conventional termination process.

**Last time faced, action, and cost.** The latest evidence is January 2026 reporting on monetization and an October 2025 creator discussion. Creators diversify across YouTube, TikTok, Instagram, Facebook, sponsorships, and merchandise. Cost is production time, unstable revenue, and dependence on multiple platforms; no typical rupiah loss was disclosed.

**Evidence.** Low–medium: real creator signals, but revenue data and direct interviews are needed. [Reddit r/indotech, 25 Oct 2025](https://www.reddit.com/r/indotech/comments/1ofzsrn/youtuber_di_ri_makin_susah_pendapatan_turun_drastis_gara_gara_ini/), [Reddit r/indonesia, 2026 creator monetization discussion](https://www.reddit.com/r/indonesia/comments/1u90ox7/facebook_creator_monetization_surge_led_by_indonesia/), [Kemenkum, royalties and AI governance, 27 Jan 2026](https://kemenkum.go.id/component/content/article/kemenkum-bertemu-youtube-bahas-royalti-hingga-tata-kelola-ai?Itemid=&catid=19&highlight=WzIwMjZd).

### 38. Households need care, but care workers lack training, protection, and trustworthy matching

**Target customer and situation.** A household needs childcare, eldercare, or domestic help, but cannot reliably verify skills, safety, employment terms, replacement coverage, or legal protections.

**Customer’s own words.** The 2025 care-economy report says the lack of qualifications and training in childcare and aged care drives reliance on domestic workers. A 2025 Indonesia domestic-worker report notes that most work is informal and not covered by robust social protection; the cited sources do not contain one standardized household quote, which is a research gap rather than evidence of no pain.

**Frequency and severity.** Care work is widespread and tied to Indonesia’s ageing population and low female labour-force participation. Severity is high because a failed match can endanger a child or older person and force a worker to leave paid employment.

**Last time faced, action, and cost.** The latest published evidence is from 2025. Families relied on relatives, informal referrals, domestic-worker agencies, or stopped working; workers accepted undocumented conditions because alternatives were limited. Cost includes agency fees, lost wages, replacement care, and safety risk.

**Evidence.** Medium: policy and labour evidence, but direct household interviews and observed matching workflows are required. [Investing in Women, Care Economy in Indonesia, Mar 2025](https://investinginwomen.asia/wp-content/uploads/2025/03/Investing-in-Women-The-Care-Economy-in-Indonesia-March-2025_final.pdf), [IDWF Indonesia report, May 2025](https://idwfed.org/wp-content/uploads/2025/05/Indonesia-Report-and-Highlights.pdf).

## Audit expansion: additional 2025–2026 problem cards

### 39. Employees at cash-starved firms cannot rely on payday

**Target customer and situation.** A private-sector employee at a small or project-based company is promised a monthly salary, but the employer’s client payment or cash flow slips. The employee needs an early warning, enforceable payment trail, and a safe exit plan.

**Customer’s own words.** In a Reddit account dated 22 Mar 2025, an IT consultant wrote that the employer had delayed the second month’s payroll and by the third month admitted there was “no money to pay” staff. The owner suggested that employees treat the job as a “side project.” [Reddit r/indonesia, 22 Mar 2025](https://www.reddit.com/r/indonesia/comments/1jhc3rs/).

**Frequency and severity.** This is one individual case, so prevalence is low-confidence. It is nevertheless consistent with the 2025 labor-pressure signals elsewhere in this report. Severity is high: food, rent, debt payments, and the employee’s bargaining power are immediately affected.

**Last time faced, action, and cost.** The latest incident was Mar 2025. The employee waited through repeated promises, learned the company had a cash-flow problem, and began considering a new job. The source describes at least one unpaid month and a second delayed month; the rupiah amount was not disclosed.

**Current workaround / competing product.** Employees borrow from family, take side work, keep applying while still employed, or resign without severance certainty. Payroll software can record the obligation but cannot make an insolvent client pay.

**Evidence.** Low–medium: one detailed first-person account plus macro job insecurity evidence. Interview employees and owners separately before treating payroll-advance, wage-insurance, or employer-risk scoring as a product opportunity.

### 40. Paid mobile data expires before the customer can use it

**Target customer and situation.** An ojol driver, online seller, student, or household buys a data package but loses the remaining quota when the validity period ends. The customer wants carry-over, proportional refund, or a clear way to choose a package that matches real usage.

**Customer’s own words.** In a petition registered at the Constitutional Court in Dec 2025, an ojol driver and online seller called the policy “penghangusan kuota sepihak” (unilateral destruction/forfeiture of quota). They argued that paid quota should be accumulated, converted to credit, or refunded proportionally. [Reddit summary of the MK case, 31 Dec 2025](https://www.reddit.com/r/indonesia/comments/1q06qk4/suamiistri_gugat_aturan_sisa_kouta_internet/).

**Frequency and severity.** The litigation proves a real consumer dispute, not national prevalence. Severity is medium for ordinary use and high when data is an input to income: the same customers may need to buy again to work.

**Last time faced, action, and cost.** The latest public incident is the Dec 2025 filing. The petitioners challenged the rule and asked for carry-over, conversion, or proportional reimbursement. Cost is the unused paid quota plus replacement data and, for workers, possible lost work; no amount was disclosed.

**Current workaround / competing product.** Customers buy shorter-validity packages, use Wi-Fi, keep multiple SIMs, or deliberately under-buy and risk running out. The workaround is behavioral rather than a real recovery path.

**Evidence.** Medium–low: a legal challenge and first-person petitioners, with no denominator. This is a strong policy pain and a weaker standalone product hypothesis.

### 41. Essential public services force digital steps without a reliable offline fallback

**Target customer and situation.** A citizen must pay parking, register a tax identity, request a document, or access a public service through an app or online form, but lacks a compatible phone, data, digital skill, or stable connection.

**Customer’s own words.** A Reddit discussion dated 24 Jun 2025 asked: “kenapa semua harus online bukan optional?” (why must everything be online rather than optional?), citing app-only parking and being told to register online before visiting the tax office. [Reddit r/indonesia, 24 Jun 2025](https://www.reddit.com/r/indonesia/comments/1lje5j4).

**Frequency and severity.** Frequency is not measured in this source. It is a recurring design pattern across public services, and severity rises sharply for older people, rural users, and anyone near a deadline. The consequence is a broker, extra trip, or abandonment of the service.

**Last time faced, action, and cost.** The latest cited incident was Jun 2025. The user questioned the online requirement and would need to use an office, another person’s device, or an intermediary. Cost is travel, data, waiting, and sometimes an unofficial service fee.

**Current workaround / competing product.** Family members, village officials, paid agents, internet cafés, office staff, and screenshots shared in WhatsApp groups provide the missing human layer.

**Evidence.** Medium–low for prevalence, high as a repeated service-design clue. A prototype should test a “digital task concierge with offline handoff,” including whether it tells a user when not to retry online.

### 42. Cashless-only and cash-only merchants exclude customers at the moment of payment

**Target customer and situation.** A buyer reaches a food stall, shop, parking point, or service counter and discovers that payment requires either cash or a specific app. The buyer needs a visible payment guarantee before consuming or travelling.

**Customer’s own words.** A Dec 2025 public discussion captured the frustration as “E-money only dan Cash only sama2 ngeselin” (e-money only and cash only are both annoying). Other replies noted that QRIS requires a smartphone and an internet connection. [Reddit r/indonesia, 21 Dec 2025](https://www.reddit.com/r/indonesia/comments/1prypnz/apapun_masalahnya_salah_gen_z/).

**Frequency and severity.** Prevalence is not quantified. The incident is usually low monetary severity but can become high when the customer is stranded, elderly, offline, or unable to reverse an attempted payment.

**Last time faced, action, and cost.** The latest discussion was Dec 2025. People carried both cash and app balances, borrowed a phone, or left the transaction. Cost is the failed purchase and time; occasionally it becomes a duplicate-payment dispute.

**Current workaround / competing product.** Carry multiple wallets, cash, cards, or ask a companion to pay. Merchant-facing payment aggregators exist, but customers still cannot know availability until the point of sale.

**Evidence.** Low–medium: repeated public discussion, no representative count. The actionable question is whether a location-level “payment accepted now” signal changes behavior enough to matter.

### 43. Delivery handoff creates surprise side-fees and conflict

**Target customer and situation.** An online shopper receives a parcel at a boarding house, apartment, or gated property and is asked for an extra parking or access payment that was not shown at checkout. The buyer needs to know what is legitimate and how to refuse without escalating a courier dispute.

**Customer’s own words.** On 2 May 2025, a buyer wrote that a Shopee parcel was left with the kos owner and the owner suddenly requested parking money: “nggak taunya ada ongkos parkir darimana coba?” (where did this parking fee suddenly come from?). [Reddit r/indonesia, 2 May 2025](https://www.reddit.com/r/indonesia/comments/1kcvadr/harus-dibayar-nggak-ini/).

**Frequency and severity.** This is an anecdotal signal, not a measured category. Severity is low per incident but repeated ambiguity can damage buyer–courier trust and create unsafe face-to-face conflict.

**Last time faced, action, and cost.** The latest incident was May 2025. The buyer asked the community whether to pay; commenters suggested refusing or reporting through the app. Cost was the disputed amount and time spent resolving it.

**Current workaround / competing product.** Tell the courier to leave the parcel, pay a small amount to avoid conflict, use a pickup point, or complain after delivery. No common standard explains legitimate access fees at checkout.

**Evidence.** Low. Keep as a discovery lead, not a priority opportunity, until courier-side and building-side frequency is measured.

### 44. Citizens cannot reliably get public agencies to answer or finish a case

**Target customer and situation.** A citizen reports a land, education, employment, police, transport, social-security, or licensing problem and receives no service, repeated delay, or a procedure that does not match the published rule. They need a case record, deadline, responsible agency, and escalation path.

**Customer’s own words.** The Ombudsman’s 2025 release does not preserve an individual quote; its recorded complaint categories are the citizens’ problem statements in administrative language: “tidak memberikan pelayanan” (not providing service), “penundaan berlarut” (protracted delay), and “penyimpangan prosedur” (procedural deviation). [Ombudsman RI, 20 Feb 2026](https://ombudsman.go.id/pers/r/ombudsman-ri-terima-23596-aduan-sepanjang-2025-tegaskan-warisan-pengawasan-berdampak-di-akhir-masa-jabatan-2021-2026).

**Frequency and severity.** Ombudsman received 23,596 public reports in 2025, including 9,365 regular reports and 9,607 consultations. The five leading maladministration categories were no service 40.68%, protracted delay 21.25%, procedural deviation 18.79%, negligence/legal noncompliance 8.75%, and improper conduct 4.29%. Severity ranges from inconvenience to blocked land, education, social-security, or business rights.

**Last time faced, action, and cost.** The latest aggregate evidence covers Dec 2025. Citizens used regular reports, consultations, rapid-response channels, or copied agencies. Ombudsman resolved 8,970 cases, but the remainder shows the queue is not a guaranteed fix. Cost includes repeated visits, waiting, transport, and blocked economic activity; the release reports Rp130.26 billion in potential public loss saved, not individual case costs.

**Current workaround / competing product.** Ombudsman, LAPOR!, elected representatives, brokers, public pressure, and informal agency contacts. The workaround is escalation literacy, which is unevenly distributed.

**Evidence.** High for system-level frequency; medium for a product opportunity. Any solution must prove it can create accountable handoffs rather than merely another complaint inbox.

### 45. Land and agrarian cases remain expensive to verify and escalate

**Target customer and situation.** A landowner, buyer, farmer, or developer needs a certificate, boundary, title, permit, or status update, but information is fragmented across BPN, local government, notaries, maps, and paper documents.

**Customer’s own words.** The 2025 Ombudsman release contains no verbatim complainant quote. It records agrarian/land affairs as the largest complaint substance and names “pengurusan sertifikasi tanah” (land-certificate processing) among the cases where Ombudsman intervention helped. [Ombudsman RI, 20 Feb 2026](https://ombudsman.go.id/pers/r/ombudsman-ri-terima-23596-aduan-sepanjang-2025-tegaskan-warisan-pengawasan-berdampak-di-akhir-masa-jabatan-2021-2026).

**Frequency and severity.** Ombudsman recorded 1,495 agrarian/land reports in 2025; BPN was the subject of 965 reports. Severity is very high where title uncertainty blocks sale, financing, inheritance, construction, or cultivation.

**Last time faced, action, and cost.** The latest aggregate evidence is 2025. Customers filed complaints, visited BPN, used notaries or lawyers, and sought Ombudsman intervention. Monetary cost is not disclosed; the operational cost is months or years of blocked property value, legal fees, and repeated travel.

**Current workaround / competing product.** Notaries, land surveyors, lawyers, brokers, BPN offices, local officials, and community records. Property portals address discovery, not title resolution.

**Evidence.** High for the administrative problem, low–medium for a scalable consumer product. Start with a document-readiness and escalation service, not automated legal conclusions.

### 46. Financial complaints require a multi-stage escalation journey that customers must coordinate

**Target customer and situation.** A bank, wallet, fintech, or payment customer has a disputed transaction and must first contact the provider, wait for resolution, then escalate to a regulator or dispute body. The customer needs one evidence trail and a trustworthy deadline.

**Customer’s own words.** The official Bank Indonesia flow does not provide a customer quote; it explicitly requires the sequence “report to the organizer,” then Bank Indonesia, then LAPS-SK if unresolved. It sets up to five working days for information misunderstandings, 20 working days for suspected violations or losses, and a possible additional 20-day extension. [Bank Indonesia, consumer complaint flow](https://www.bi.go.id/en/pelindungan-konsumen/adukan-kendala/default.aspx).

**Frequency and severity.** OJK received 57,366 financial consumer complaints from 1 Jan to 13 Jul 2026: 25,443 fintech, 18,578 banking, and 11,418 finance-company complaints. This is not a measure of unresolved cases, but it shows substantial demand for recourse.

**Last time faced, action, and cost.** The latest aggregate evidence is Jul 2026. A complainant must save transaction evidence, obtain a provider response, and decide whether to escalate. Cost is the disputed amount plus up to 40 working days of uncertainty in the defined workflow; actual cases can take longer.

**Current workaround / competing product.** Provider chat, call centres, BI, OJK APPK, LAPS-SK, social-media escalation, and consumer organizations. Each institution owns only part of the timeline.

**Evidence.** High for the process burden; medium for willingness to pay. The product test is whether a customer can generate a regulator-ready case without accidentally restarting the clock.

### 47. Retail-investment deposits can appear in the bank but not in the investment app

**Target customer and situation.** A retail investor transfers money to an RDN or investment wallet, but the bank balance and the broker/app balance disagree. The customer cannot tell whether to wait for settlement, retry, or stop trading.

**Customer’s own words.** A Reddit investor wrote on 23 Jan 2026: “Transfer ke RDN BCA, duit gak masuk di aplikasi Bibit/Stockbit, tapi di M-BCA saldo RDN tetep masuk” and later “dari pagi sampe malem duitnya gak masuk-masuk ke Saldo Stockbit/Bibit” (the transfer is in the BCA RDN, but it is not in the Bibit/Stockbit app; it has not entered the app balance from morning until night). [Reddit r/finansial, 23 Jan 2026](https://www.reddit.com/r/finansial/comments/1qksubx/saldo_rdn_nyangkut/).

**Frequency and severity.** One incident is not prevalence. Severity is medium–high: funds are visible in one system but unavailable for investing or withdrawal, and a user may duplicate the transfer.

**Last time faced, action, and cost.** The latest case was Jan 2026. The investor checked both systems and waited; the amount was not stated. Cost is temporarily locked liquidity, missed market timing, and support time.

**Current workaround / competing product.** Wait through T+ settlement, check bank mutation, contact broker and bank separately, or use another broker. Stockbit’s own help page explains that some withdrawals can take up to two working days, which does not resolve an unexplained mismatch.

**Evidence.** Low–medium: first-person incident plus provider documentation. Validate with transaction logs from multiple brokers before building a reconciliation layer.

### 48. A small missed PayLater payment can trigger a disproportionate fee

**Target customer and situation.** A consumer uses a promotional instalment or PayLater product, misses a small amount or deadline, and discovers a penalty that is much larger than the missed payment. They need total-cost clarity and reliable reminders before checkout.

**Customer’s own words.** A May 2026 Reddit post was titled: “lupa bayar paylater 10.000, denda telatnya 50.000” (forgot to pay Rp10,000 of PayLater; the late fee was Rp50,000). The thread also discusses promotional “real 0%” checkout incentives. [Reddit r/indonesia, 3 May 2026](https://www.reddit.com/r/indonesia/comments/1t2gj9q/dont_be_like_me_lupa_bayar_paylater_10000_denda/).

**Frequency and severity.** The anecdote is not a prevalence estimate. OJK reported BNPL financing of Rp13.40 trillion in Jun 2026, up 57.02% year on year, with gross NPF 3.09%; a large and growing balance makes comprehension and repayment timing consequential.

**Last time faced, action, and cost.** The latest cited incident was May 2026. The user paid or investigated the fee through the community; the explicit cost was Rp50,000 on a Rp10,000 missed payment. Consequences include repeat borrowing, damaged credit history, and stress.

**Current workaround / competing product.** Calendar reminders, spreadsheets, bank auto-debit, avoiding PayLater, or shifting debt between platforms. Product tests must distinguish fee explanation from lending advice.

**Evidence.** Medium: one precise cost example plus official market-scale data. A safe prototype should reveal full repayment amount before purchase and simulate late scenarios.

### 49. Essential medicines can be unavailable even when the patient is entitled to care

**Target customer and situation.** A patient at a Puskesmas or other primary-health centre has a prescription or a chronic-care need, but the essential medicine is out of stock. They need a reliable stock signal and a safe alternative path.

**Customer’s own words.** The 2025 mixed-method study reports frontline coping rather than a patient quote: health workers sometimes had to deviate from policy and use capitation funds to purchase medicine during temporary stockouts. The study also records a practice of splitting a different tablet strength when the prescribed strength was unavailable. [Fanda et al., *Health Policy and Planning*, 1 Apr 2025](https://pure.eur.nl/en/publications/managing-medicines-in-decentralization-discrepancies-between-nati/).

**Frequency and severity.** Interviews with 56 health workers in two Indonesian districts found occasional essential-medicine unavailability, attributed to supplier shortages and local-system capacity. Severity is high for tuberculosis, maternal/neonatal care, and noncommunicable diseases; interruption can cause extra travel, private purchase, or treatment failure.

**Last time faced, action, and cost.** The latest published fieldwork is reported in 2025. Health workers improvised procurement and local patients were directed to whatever alternative was available; the study does not quantify patient out-of-pocket cost. The cost is unquantified but can include transport, private pharmacy prices, and missed treatment.

**Current workaround / competing product.** Call the Puskesmas, visit another facility, buy privately, borrow medicine, or ask staff to substitute. A public stock map would need freshness guarantees and clinical safeguards.

**Evidence.** High for the operational problem and interview-backed; medium for national prevalence because the study covers two districts.

### 50. Mental-health demand exceeds the supply of human attention

**Target customer and situation.** A young Indonesian experiences anxiety, school, relationship, family, or overthinking problems but cannot quickly access an affordable human counsellor. They need a safe first response and a clear boundary between light support and clinical care.

**Customer’s own words.** No direct customer quote was available in the source. A June 2025 report says a Snapcart survey of 3,611 Indonesian respondents found 6% used AI to “curhat” (vent or confide), while Tenang.ai’s CEO said the service was created because she could personally handle only three to four clients per day and the service had exceeded 50,000 users. [StartupIndonesia, 2025](https://startupindonesia.id/newsletter/saat-ai-jadi-tempat-curhat-sejumlah-startup-melirik-peluang).

**Frequency and severity.** Six percent of a 3,611-person survey is a meaningful demand signal, not a clinical prevalence measure. Severity ranges from mild distress to unsafe self-treatment; the main risk is confusing conversational comfort with professional care.

**Last time faced, action, and cost.** The latest evidence is 2025. People used AI, online counselling, friends, or waited for a psychologist. Cost is the consultation fee and waiting time, but the source does not provide a typical amount.

**Current workaround / competing product.** Tenang.ai, Halodoc, WhatsApp support, school counsellors, religious/community networks, and general AI chatbots. A responsible product must include triage and escalation, not only conversation.

**Evidence.** Medium: survey plus provider interview, but no direct user interview in this scan.

### 51. Patients lose time because doctor capacity is concentrated and waiting is uncertain

**Target customer and situation.** A patient needs a doctor or follow-up but cannot predict the queue. They may wait for hours, leave before being seen, or pay for telehealth because the physical route is too uncertain.

**Customer’s own words.** This source is a published founder observation rather than a patient quote. Halodoc’s founder said Indonesia has about three doctors per 10,000 people, that some doctors see 100 patients a day, and that while he was waiting to meet doctors, patients often became tired and went home. [McKinsey interview with Halodoc’s Jonathan Sudharta, 4 Feb 2025](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/connecting-patients-to-healthcare-a-conversation-with-halodocs-jonathan-sudharta).

**Frequency and severity.** The ratio and observation are not a national waiting-time dataset, but they explain the recurring queue problem already visible in Mobile JKN and hospital complaints. Severity is high for chronic care, working caregivers, and time-sensitive symptoms.

**Last time faced, action, and cost.** The latest interview was Feb 2025. Patients waited, left, used telehealth, or sought another provider. Cost is hours of waiting, lost work, and possibly a private consultation fee.

**Current workaround / competing product.** Hospital booking apps, telehealth, private clinics, early-morning queues, and informal staff contacts. The unresolved need is confidence that an appointment will actually happen.

**Evidence.** Medium–high: direct observation and provider interview, strengthened by independent queue evidence; national frequency remains to be measured.

### 52. Blue-collar workers are poorly served by job matching and formal credit systems

**Target customer and situation.** A high-school or diploma-level worker needs a job, short-term income, training, or a small loan. White-collar job boards and bank scoring assume a stable CV, monthly salary, and bank history that the worker does not have.

**Customer’s own words.** Pintarnya’s co-founder told TechCrunch that mass workers traditionally find jobs through fairs or word of mouth, with employers buried in paper applications and candidates “rarely hearing back.” He also said many borrowers are pushed toward family/friends or predatory lenders. [TechCrunch interview, 24 Aug 2025](https://techcrunch.com/2025/08/24/pintarnya-raises-16-7m-to-power-jobs-and-financial-services-in-indonesia/).

**Frequency and severity.** Pintarnya reported more than 10 million job-seeker users and 40,000 employers; these are company figures, not market prevalence, but they show scale. Severity is high: no job means no income, and the credit workaround can be abusive.

**Last time faced, action, and cost.** The latest evidence is Aug 2025. Workers used job fairs, word of mouth, quick-apply roles, side income, family loans, or informal lenders. Cost is lost search time and expensive or unsafe credit; exact individual amounts were not disclosed.

**Current workaround / competing product.** JobStreet, Kalibrr, Glints, offline fairs, referrals, WhatsApp groups, Pintarnya, and informal lenders. The best test is whether verified walk-in or shift work can produce a paid interview or first shift faster than a conventional application.

**Evidence.** Medium–high: provider interview and reported platform scale, but company claims need independent worker interviews.

### 53. Parents cannot compare kindergarten prices without manual research and surprise visits

**Target customer and situation.** A Jakarta-area parent searches for a kindergarten or pre-kindergarten that fits budget, location, language, safety, and facilities. Many schools disclose fees only after a direct enquiry or visit.

**Customer’s own words.** A parent wrote in June 2026 that they manually researched about 172 Jabodetabek kindergartens, with prices ranging from free public options to Rp39 million per month. “Banyak yang lebih besar dari SPP setahun penuh dan itu baru tau pas udah dateng survey” (many entrance fees are bigger than a full year’s tuition, and you only find out after visiting). [Reddit r/IndoParenting, 13 Jun 2026](https://www.reddit.com/r/IndoParenting/comments/1u4mwke/susahnya_cari_info_biaya_tk_di_jakarta_hampir/).

**Frequency and severity.** One parent’s dataset is not prevalence, but the search burden is concrete. Severity is medium–high: childcare and education decisions are recurring and expensive, and a wrong choice can consume a year’s fees.

**Last time faced, action, and cost.** The latest incident was Jun 2026. The parent built a manual comparison from 172 schools, used Rookie.id, Instagram reviews, and direct visits. Cost includes research hours, travel, and the risk of an undisclosed entrance fee; the parent did not quantify hours.

**Current workaround / competing product.** Rookie.id, Instagram, parent forums, school visits, WhatsApp admin, and word-of-mouth. Existing portals often omit true total cost and safety evidence.

**Evidence.** Medium: precise first-person workflow and a 2026 government cost study, but one household. A prototype should test whether parents trust a normalized total-cost and safety profile enough to shortlist without visiting every school.

### 54. Education access is still experienced as an inequality of location, infrastructure, and school capacity

**Target customer and situation.** A student or parent chooses among schools with sharply different infrastructure, teacher capacity, technology, class size, and costs. They need to know what a school can realistically provide before committing time and money.

**Customer’s own words.** The Ipsos Education Monitor summary does not include a verbatim Indonesian parent or student quote. It reports the problem in respondents’ own survey selection: 59% named unequal access as Indonesia’s largest education challenge, followed by inadequate infrastructure at 37%, teacher quality at 30%, and inadequate technology use at 29%. [DetikEdu summary of Ipsos Education Monitor 2025, 20 Jan 2026](https://www.detik.com/edu/sekolah/d-8314463/survei-orang-ri-menilai-ketimpangan-akses-jadi-tantangan-utama-pendidikan).

**Frequency and severity.** The survey covered 23,700 internet users across 30 countries, including Indonesia; the percentages are respondent perceptions, not enrollment outcomes. Severity is high because poor access can reduce learning, force migration or private spending, and contribute to dropout.

**Last time faced, action, and cost.** The latest survey fieldwork was Jun–Jul 2025, reported in Jan 2026. Families used private schools, tutoring, migration, devices, or online alternatives where possible. Costs are tuition, transport, devices, and opportunity cost; no typical household amount is given.

**Current workaround / competing product.** School directories, tutoring, scholarship groups, private schools, community learning, and informal parent comparisons. The gap is trustworthy, local, comparable information tied to a child’s actual route and budget.

**Evidence.** Medium–high for perceived problem; medium for a service opportunity because infrastructure itself cannot be solved by information alone.

### 55. Accessible public transport can disappear or be too hard to use for disabled workers

**Target customer and situation.** A blind, mobility-impaired, or otherwise disabled worker relies on a bus to reach customers or employment. The service stops, is inaccessible, or lacks staff and infrastructure that make the route usable.

**Customer’s own words.** On 2 Jan 2025, blind massage worker Vincensius Murat said of the suspended Trans Metro Dewata: “Kami tuna netra sangat senang menggunakan Trans Metro Dewata karena sebagai penyandang disabilitas kami keliling menggunakan bus, hari ini kami kecewa karena busnya diberhentikan, pekerjaan kami sangat sulit jadinya” (we blind people were very happy using the bus; today we are disappointed because it stopped and our work became very difficult). [ANTARA Bali, 2 Jan 2025](https://bali.antaranews.com/berita/366194/penyandang-disabilitas-ingin-trans-metro-dewata-beroperasi-lagi).

**Frequency and severity.** This incident affected a community of disabled passengers and bus workers; it is not a national prevalence estimate. Severity is high because loss of an accessible route directly removes work access and independence.

**Last time faced, action, and cost.** The latest incident was Jan 2025. Users petitioned at the terminal and asked the service to resume; the route later returned after a funding arrangement. Cost was lost or harder-to-reach customers and dependence on less accessible alternatives.

**Current workaround / competing product.** Family assistance, private ride-hailing, walking, informal transport, or abandoning the trip. Accessibility information and service continuity are both required.

**Evidence.** High for this specific lived experience because it is a dated first-person interview; medium for a larger market. A prototype should be observed with disabled passengers, not only tested by able-bodied researchers.

### 56. Island communities lose access to normal passenger and goods logistics when a port fails

**Target customer and situation.** A resident, farmer, trader, or fisher on a remote island needs the port to move people, food, and harvest. Sedimentation or a failed route forces transfer to small boats and makes normal vehicles and freight impossible.

**Customer’s own words.** In Jun 2025 reporting from Enggano, an ASDP supervisor said: “Kapal terpaksa menurunkan penumpang di tengah laut, tak bisa masuk ke pelabuhan” (the ship has to unload passengers in the middle of the sea; it cannot enter the port). The report said around 4,000 residents were affected and the port had been unusable for eight months. [Kompas, 19 Jun 2025](https://regional.kompas.com/read/2025/06/19/084635878/ekonomi-enggano-lumpuh-warga-barter-ikan-demi-beras?page=all).

**Frequency and severity.** The eight-month disruption is a high-severity local event, not a national frequency measure. Produce such as bananas, cocoa, and fish could not move normally, shops became quiet, and residents reportedly bartered fish for rice.

**Last time faced, action, and cost.** The latest report was Jun 2025, after eight months of disruption. Residents jointly rented or used small boats and transferred people and goods for hours. Cost includes chartering, spoilage, hours of travel, and higher prices for basic goods.

**Current workaround / competing product.** Patungan boat hire, small-boat transshipment, barter, local stockpiles, and waiting for government dredging. A logistics product cannot replace a port, but it may coordinate shared freight, cold storage, and demand.

**Evidence.** High for the local problem and direct reporting; low for a national software market. Validate across several islands before generalizing.

### 57. Households struggle to keep food and transport spending predictable

**Target customer and situation.** An urban or lower-middle-income household plans weekly meals and commuting while rice, vegetables, electricity, and transport prices fluctuate. They need a way to preserve nutrition and mobility without relying only on promotions or debt.

**Customer’s own words.** A 2025 national survey found 44% of Indonesians named lowering daily living costs among their three most important issues. An interviewee described the pressure as “prices, especially food prices, basic food prices and also transportation.” Rice was reported around Rp10,000/kg in 2015 and as high as Rp15,000/kg in the later survey period. [SBS Indonesian report on Roy Morgan interviews, 19 Jul 2025](https://www.sbs.com.au/language/indonesian/en/podcast-episode/cost-of-living-defeats-corruption-eradication-issue/vobfb5k77).

**Frequency and severity.** The 44% signal is broad and measured. Severity is high for households with fixed income, because the consequence is smaller meals, lower-quality nutrition, missed trips, delayed bills, or high-cost credit.

**Last time faced, action, and cost.** The latest interview period ran Oct 2024–Mar 2025. Households substituted food, chased promotions, reduced discretionary travel, borrowed, or added work. The cited price movement gives a concrete food cost change, but not a representative monthly budget impact.

**Current workaround / competing product.** Supermarket promotions, WhatsApp price groups, warung comparison, budgeting spreadsheets, meal substitutions, and BNPL. A budgeting tool alone will not help unless it connects actual local prices to a feasible meal and travel plan.

**Evidence.** High for concern and medium for a product opportunity. Measure retention by whether households change purchases or avoid late fees, not by app opens.

### 58. Lenders need trustworthy signals from messy borrower documents

**Target customer and situation.** A lender serving Indonesian or other emerging-market borrowers receives bank statements, payslips, PDFs, photos, and informal income records in inconsistent formats. The credit team must decide quickly while detecting manipulation and fraud.

**Customer’s own words.** The Product Hunt maker of Kita said credit teams spend too much time “chasing documents, reviewing files by hand, and piecing together fragmented information from inconsistent, chaotic formats.” The maker explicitly listed Indonesia among markets where credit bureaus are limited and open banking is nascent. [Product Hunt, Kita, 2026](https://www.producthunt.com/products/kita).

**Frequency and severity.** Product Hunt supplies a maker signal and a commenter who said document manipulation is what lenders cannot catch manually at scale; it does not establish Indonesian prevalence. Severity is high for lenders: slow decisions, fraud losses, and exclusion of borrowers whose income does not fit standard data.

**Last time faced, action, and cost.** The latest public signal is the 2026 launch. Teams manually chased files, reviewed documents, and assembled risk decisions. Cost is staff time and delayed or wrong lending; the source gives no rupiah figure.

**Current workaround / competing product.** Manual underwriting, credit bureaus, bank statements, spreadsheets, alternative credit scoring, and lender-specific document checklists.

**Evidence.** Low–medium for Indonesia specifically; useful as a B2B hypothesis. Interview Indonesian lenders and ask for the last rejected or delayed file, review minutes, fraud incident, and approval-rate impact.

### 59. Complaint handling needs consistent, empathetic, cross-channel operations

**Target customer and situation.** A large digital platform receives complaints through in-app chat, email, social media, and support tickets. A customer repeats the story across channels because ownership, evidence, and status are not carried forward.

**Customer’s own words.** The 2025 Tokopedia case study did not publish a customer quote in its abstract. It describes the work as requiring empathy, message clarity, prompt response, and triangulation through interviews, participatory observation, and secondary data. [Mercu Buana repository, Tokopedia customer-service study, deposited 4 Mar 2025](https://repository.mercubuana.ac.id/94623/).

**Frequency and severity.** This is not a customer-volume estimate. It is a support-operations signal: when complaint context is lost, customers spend time repeating evidence and the platform absorbs avoidable handling cost. Severity ranges from frustration to unrecovered money or churn.

**Last time faced, action, and cost.** The latest source record is Mar 2025. The study examined Tokopedia’s Customer Fulfillment Services, while app reviews elsewhere show users switching between bots, email, social support, and call centres. Cost is repeat contacts and staff handling time; no case-level amount was provided.

**Current workaround / competing product.** Omnichannel CRM, social-media escalation, consumer organizations, and platform-specific CFS teams. A solution must connect a complaint’s facts and state, not merely add another chatbot.

**Evidence.** Medium for an operational problem, low for a new standalone market. The next step is observation of real support agents and customers handling one unresolved case end to end.

## Digital-product fit classification

Fit is judged against a narrow customer job, not the whole social problem. A card is **digital-addressable** when software can deliver the main workflow outcome (for example, reconcile a transaction, assemble an evidence packet, compare verified options, or route a complaint). It is **digital-assisted** when software can improve coordination or visibility but an offline operator, infrastructure owner, or regulator still controls the outcome. It is **structurally non-digital** when software can only observe or marginally improve the root cause.

| # | Existing problem | Digital-product fit | Digital job and boundary |
|---:|---|---|---|
| 1 | Marketplace post-purchase failure | Digital-addressable | Assemble order, payment, courier, and product evidence; route refund or replacement steps. |
| 2 | Payment deducted but not delivered | Digital-addressable | Reconcile transaction state, prevent unsafe retries, and create an escalation packet. |
| 3 | Scam recovery is fragmented | Digital-addressable | Freeze/report/track a fraud incident across provider and regulator channels. |
| 4 | Coretax and digital identity workflows | Digital-addressable | Diagnose the blocked state and recommend the next valid action before a deadline. |
| 5 | BPJS/outpatient queues and OTP | Digital-addressable | Coordinate appointment, queue, and arrival decisions; clinical capacity remains outside the product. |
| 6 | Internet reliability and support | Digital-assisted | Verify outage state and preserve a support case; network quality remains physical. |
| 7 | Public transport first/last mile | Digital-assisted | Plan a reliable route and fallback; vehicle supply and street infrastructure remain external. |
| 8 | Platform-worker net earnings and penalties | Digital-assisted | Calculate net earnings and preserve appeal evidence; platforms control allocation and pay. |
| 9 | Housing title, delivery, accountability, and refunds | Digital-addressable | Verify documents, milestones, counterparties, and complaint escalation. |
| 10 | Job search ghosting, mismatch, and fraud | Digital-addressable | Verify listings, track applications, and expose stale or risky opportunities. |
| 11 | Fragmented social-commerce selling | Digital-addressable | Unify WhatsApp, marketplace, QRIS, COD, inventory, and settlement records. |
| 12 | Local-payment and SaaS billing friction | Digital-addressable | Provide local payment, billing, reconciliation, and failed-payment recovery infrastructure. |
| 13 | Opaque public-service workflows and brokers | Digital-assisted | Explain steps and provide an offline handoff; agencies still control completion. |
| 14 | Super-app tasks are hard to find | Digital-addressable | Make high-frequency tasks discoverable and stateful across product surfaces. |
| 15 | Digital identity still needs office activation | Digital-assisted | Prepare documents and manage the office handoff; activation authority remains offline. |
| 16 | Utility complaints close while problems remain | Digital-addressable | Track evidence, SLA, status changes, and escalation rather than just opening a ticket. |
| 17 | Water outages lack status or escalation | Digital-assisted | Coordinate outage reports and alternatives; water infrastructure remains external. |
| 18 | Courier tracking stalls | Digital-addressable | Detect exception states and coordinate customer, seller, and courier evidence. |
| 19 | Courier-merchant apps fail at label/COD/QRIS | Digital-addressable | Recover failed merchant actions and reconcile order, payment, and shipment state. |
| 20 | Travel booking price/availability/support drift | Digital-addressable | Lock, compare, and explain booking state, fees, changes, and refund rights. |
| 21 | Train-ticket payment and refunds | Digital-addressable | Explain payment verification, seat state, refund status, and next action. |
| 22 | Food delivery hides driver scarcity | Digital-assisted | Expose fulfilment probability and fallback; courier supply remains external. |
| 23 | Mobile-data payment/quota mismatch | Digital-addressable | Reconcile payment, quota, expiry, and carrier support evidence. |
| 24 | Cross-provider payment disputes | Digital-addressable | Coordinate a single case across banks, wallets, cards, and merchants. |
| 25 | Banking login and QRIS failure | Digital-addressable | Diagnose access/payment failure and route recovery without repeated retries. |
| 26 | Illegal lending and debt collection | Digital-assisted | Detect, document, and escalate abuse; enforcement and lender conduct remain external. |
| 27 | BNPL repayment risk is hard to see | Digital-addressable | Show total cost, late scenarios, credit impact, and safer alternatives before purchase. |
| 28 | Unsafe or illegal marketplace products | Digital-addressable | Verify seller/product signals and assemble a safety or refund case. |
| 29 | School fees and late assistance | Structurally non-digital | Software may expose fees, but funding, entitlement, and school practice determine the outcome. |
| 30 | Daycare is distant, full, or unverified | Digital-addressable | Compare verified capacity, price, safety, distance, and waitlist status. |
| 31 | Air pollution lacks actionable information | Digital-assisted | Convert measurements into decisions; emissions and exposure remain external. |
| 32 | Waste, flooding, and green-space deficits | Digital-assisted | Coordinate reports and local response; remediation remains municipal/physical. |
| 33 | Farmer price and land-compliance uncertainty | Digital-assisted | Provide market/compliance data; prices, enforcement, and land rights remain external. |
| 34 | MSME digital payments lack operations | Digital-addressable | Turn QRIS, cash, bank, marketplace, and sales data into a usable ledger and cash-flow view. |
| 35 | B2B credit and insolvency uncertainty | Digital-assisted | Improve signals and collections; borrower solvency remains economic and legal. |
| 36 | Layoffs and job insecurity | Structurally non-digital | Matching and benefits can help, but employment demand and layoffs are not software problems. |
| 37 | Creator income and algorithm volatility | Digital-assisted | Forecast, diversify, and document revenue changes; platforms control reach and monetization. |
| 38 | Care-worker training, protection, and matching | Digital-assisted | Match, train, and document care work; supply, pay, and protections remain human/legal. |
| 39 | Employers cannot reliably pay wages | Structurally non-digital | Payroll software cannot solve employer insolvency or enforce wage recovery. |
| 40 | Paid mobile data expires unused | Digital-assisted | Alert, compare, and document usage; carryover/refund depends on carrier policy. |
| 41 | Essential services force online steps without fallback | Digital-addressable | Provide a task concierge, eligibility check, and reliable offline handoff. |
| 42 | Cashless-only and cash-only payment exclusion | Digital-assisted | Route payment options and show acceptance; merchants and connectivity remain constraints. |
| 43 | Delivery handoff surprise side-fees | Digital-addressable | Disclose fees before handoff and preserve acceptance/refusal evidence. |
| 44 | Public agencies do not finish cases | Digital-addressable | Maintain a case timeline, owner, deadline, evidence bundle, and escalation path. |
| 45 | Land/agrarian cases are costly to verify | Digital-addressable | Normalize documents, map stakeholders, and prepare a defensible case file. |
| 46 | Financial complaints require multi-stage escalation | Digital-addressable | Orchestrate provider, BI/OJK, LAPS-SK, deadlines, and evidence in one case. |
| 47 | Investment deposits do not appear in the app | Digital-addressable | Reconcile bank, RDN, broker, and app state with an incident timeline. |
| 48 | Small PayLater misses trigger large fees | Digital-addressable | Simulate late cost and make repayment risk visible before and after purchase. |
| 49 | Essential medicines are unavailable | Digital-assisted | Track stock and alternatives; procurement and supply capacity remain external. |
| 50 | Mental-health demand exceeds human attention | Digital-assisted | Triage, support low-acuity needs, and route safely to human care. |
| 51 | Doctor capacity and waiting are uncertain | Digital-addressable | Coordinate appointment, queue, arrival, and alternative-provider decisions. |
| 52 | Blue-collar job matching and formal credit | Digital-addressable | Match verified work and create a safer path to income-linked financial services. |
| 53 | Kindergarten cost comparison is manual | Digital-addressable | Normalize total cost, location, capacity, and visit requirements. |
| 54 | Education access inequality | Structurally non-digital | Digital access can reduce friction, but infrastructure and school capacity dominate. |
| 55 | Accessible public transport disappears | Digital-assisted | Publish accessible route continuity and alternatives; service availability remains external. |
| 56 | Island logistics fail when ports fail | Digital-assisted | Coordinate shared freight, demand, and cold-chain alternatives; port capacity remains physical. |
| 57 | Food and transport costs are unpredictable | Structurally non-digital | Budgeting and price data help, but inflation and household income are the root drivers. |
| 58 | Lenders face messy borrower documents | Digital-addressable | Extract, verify, compare, and route inconsistent evidence for underwriting. |
| 59 | Complaint handling is inconsistent across channels | Digital-addressable | Carry facts, ownership, SLA, and resolution state across channels. |

**Classification result.** Thirty-four cards have a viable software-first workflow, twenty are digital-assisted, and five are structurally non-digital. Only software-first cards enter the ranking below. A software-first label does not mean the product can force an agency, bank, courier, or marketplace to comply; it means the product can deliver a meaningful customer outcome before that dependency is resolved.

## Ranked digital-product opportunity clusters

The score is a weighted 0–100 judgment: frequency 15%, severity 15%, time/financial cost 15%, digital addressability 20%, evidence strength 15%, workaround intensity 10%, and buyer reachability/regulatory feasibility 10%. The ranking is provisional until direct participant interviews are completed. Public first-person accounts satisfy the evidence gate for the top ten; none of the top three is presented as validated primary research.

| Rank | Opportunity cluster | Cards | Component scores (frequency/severity/cost/digital/evidence/workaround/buyer) | Score | Evidence gate and product wedge |
|---:|---|---|---|---:|---|
| 1 | Payment, scam, and financial-complaint recovery | 2, 3, 24, 46, 47, 48 | 5/5/5/5/5/5/4 | **98** | OJK/IASC and BI workflows, e-wallet studies/reviews, and first-person Reddit cases. Product wedge: one incident timeline, safe next action, evidence packet, and deadline tracker. |
| 2 | Marketplace and courier post-purchase recovery | 1, 18, 19, 28, 43 | 5/4/4/5/5/4/4 | **90** | 800-person marketplace survey, courier review study, app reviews, and first-person counterfeit/refund cases. Product wedge: order/payment/courier/product evidence and one resolution path. |
| 3 | Trusted job matching and application integrity | 10, 52 | 5/4/4/5/4/4/4 | **87** | First-person job-seeker reports, DPR fraud data, and Pintarnya employer/job-seeker evidence. Product wedge: verified listing, application status, employer response signal, and scam screening. |
| 4 | Tax, identity, and public-service workflow navigation | 4, 14, 41, 44 | 4/4/4/5/4/5/4 | **86** | DJP issue list, Ombudsman warning/complaints, public user reports, and LAPOR workflow. Product wedge: state diagnosis, deadline-aware next step, and offline handoff. |
| 5 | MSME and social-commerce operating layer | 11, 34 | 4/4/4/5/4/4/4 | **84** | MSC seller study, QRIS research with interviews/merchant samples, and seller discussions. Product wedge: orders, QRIS/cash/bank settlement, margin, inventory, and customer follow-up. |
| 6 | BNPL and digital-credit risk transparency | 27, 48 | 4/5/5/4/4/4/3 | **81** | OJK market/complaint data, consumer penalty example, and reporting on collection misconduct. Product wedge: total-cost and late-scenario simulator plus safe escalation. |
| 7 | Healthcare appointment and queue navigation | 5, 51 | 4/5/4/4/4/4/3 | **81** | Mobile JKN reviews, 2025–26 queue studies with observation/interviews, and provider evidence. Product wedge: trustworthy queue state, arrival timing, and fallback provider choice; clinical capacity remains external. |
| 8 | Housing and land document/complaint verification | 9, 45 | 3/5/5/4/4/4/3 | **81** | BPKN, Ombudsman housing cases, BENAR-PKP complaint workflow, and first-person buyer accounts. Product wedge: document/milestone evidence, counterparty map, and escalation route. |
| 9 | Cross-channel complaint case orchestration | 16, 44, 59 | 4/3/3/5/4/4/4 | **78** | Tokopedia case study, BI/OJK/Ombudsman complaint workflows, and app-review support failures. Product wedge: portable case record, owner, SLA, evidence, and resolution state. |
| 10 | Travel booking, payment, and refund exception handling | 20, 21 | 4/3/3/5/3/4/4 | **75** | YouGov stress survey, Traveloka reviews, Access by KAI complaint study, and first-person refund questions. Product wedge: availability/price/payment/refund state with clear action and deadline. |

**Ranking interpretation.** The first two clusters have the strongest combination of measured frequency, severe financial consequences, repeated cross-provider workarounds, and a clear software workflow. Job matching ranks highly because the customer cost is repeated unpaid application time and fraud exposure, while an integrity layer can be useful without owning the whole labor marketplace. The healthcare and housing clusters are high-severity but have more operational and regulatory dependencies, so their prototypes must test trust and handoff rather than promise an outcome the product cannot control.

## Top-three field-validation plans

These are validation plans, not completed research results. Direct interviews and observed prototype sessions remain pending because no participants were available in this implementation.

### Candidate A — Payment and scam recovery

**Recruit.** Six recent users of bank, wallet, QRIS, RDN, or IASC workflows: at least three with a deducted-but-missing payment and three with a suspected scam or illegal-lending incident. Require an incident within the last twelve months and at least one attempted support contact. Never request account credentials, PINs, OTPs, or full account numbers.

**Prototype task.** Give the participant a realistic redacted transaction record and ask them to decide whether to wait, retry, freeze, report, or escalate; then produce the evidence packet and next-action checklist.

**Observe.** State comprehension, unsafe retry intent, evidence completeness, number of wrong channels selected, time to a defensible next action, and trust in the recommendation. The prototype must not imply guaranteed recovery or provide individualized financial/legal advice.

### Candidate B — Marketplace and courier post-purchase recovery

**Recruit.** Six recent buyers or sellers with a late, damaged, counterfeit, missing, or refunded-but-unresolved order. Include both marketplace-native and WhatsApp/social-commerce transactions.

**Prototype task.** Combine a redacted order, payment proof, courier status, product photo, and seller chat. Ask the participant to identify the case state, choose the correct resolution route, and submit a complete case without repeating the story across channels.

**Observe.** Whether the user trusts the case state, finds missing evidence, understands deadlines, avoids opening conflicting cases, and can explain what will happen next.

### Candidate C — Trusted job matching and application integrity

**Recruit.** Six job seekers or blue-collar workers who applied to at least five roles in the last six months, including at least two who encountered ghosting, suspicious payment requests, or a fraudulent listing.

**Prototype task.** Give the participant three realistic listings. Ask them to assess risk, decide whether to apply, save evidence of the employer’s response commitment, and return later to interpret a status change.

**Observe.** Screening accuracy, time spent, willingness to trust verification, whether the user still uses WhatsApp or personal referrals, and whether the workflow reduces unpaid application work rather than adding another job board.

## Interview and prototype record

The fieldwork target is 16–20 interviews: 6 consumers, 4 MSME/social-commerce sellers, 4 job seekers/platform workers, and 2–6 business/support or institutional users. Each session should be 30–45 minutes, conducted in Indonesian or the participant’s preferred language, with consent and anonymized notes.

Every session must capture:

- the last incident date and exact situation;
- what happened immediately before it;
- each action taken and each channel contacted;
- time, money, travel, lost work, stress, or safety cost;
- the current workaround and what it replaced;
- what remains unresolved;
- what the participant would trust a digital product to do;
- what the participant would never delegate to software.

For each of the three prototypes, observe at least five participants. Record task completion, time, pauses, wrong turns, facilitator interventions, trust signals, and the participant’s own explanation of the next action. The acceptance threshold is 4 of 5 participants completing the critical workflow without intervention and 4 of 5 explaining the system state and next step correctly. Any failure is recorded as a usability or evidence gap, not automatically converted into a feature request.

## Research limitations and gaps

- Direct interviews were not conducted in this implementation. The report uses published interviews from Fairwork/CIPG, MicroSave/MSC, the Pulitzer Center, health-worker research, and published telephone surveys, and labels them accordingly. The top three are provisional until the fieldwork plan above is completed.
- Product Hunt and Hacker News produced useful builder and infrastructure clues but limited Indonesia-specific 2025–26 prevalence data. The SaaS billing problem remains a discovery hypothesis.
- App reviews are not representative and often overrepresent severe incidents. Review helpful-vote counts indicate resonance, not incidence.
- Administrative complaints are underreported and may be affected by awareness of a complaint channel, legal sophistication, and the size of the affected customer base.
- Cost is often not disclosed. The next research round should collect transaction amount, time to resolution, number of contacts, travel cost, lost work hours, and whether the problem was ultimately resolved.
- Indonesia is not one market. Follow-up work should segment by city, connectivity, income, language, gender, age, and formal/informal status.
- The fit classification is an analytical judgment about a narrow digital job, not proof that a software product can solve the underlying institutional or infrastructure problem.
- The weighted scores are prioritization judgments, not market-size estimates or willingness-to-pay measurements. Interviews must test buyer identity, payment behavior, and trust before investment decisions.

## Sources

1. [Kementerian Perdagangan, “Laporan Layanan Pengaduan Konsumen Tahun 2025.”](https://ditjenpktn.kemendag.go.id/secara-berkala/ditpk/2024-09-22-laporan-layanan-pengaduan-konsumen-a2s2c) 2025.
2. [Databoks/Katadata, “Ragam Kendala Konsumen Marketplace di Indonesia.”](https://databoks.katadata.co.id/teknologi-telekomunikasi/statistik/68d129c55020f/ragam-kendala-konsumen-marketplace-di-indonesia) 22 Sep 2025.
3. [Shopee Indonesia, Google Play reviews.](https://play.google.com/store/apps/details?gl=US&hl=en&id=com.shopee.id) Reviews dated 23 Mar and 16 Jun 2025.
4. [OJK, Financial Services Sector Stability, 2025 consumer complaints.](https://www.ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Pages/Financial-Services-Sector-Stability-Maintained-Amid-Global-and-Domestic-Dynamics.aspx) 2025.
5. [OJK, “Waspada Penipuan Website Mengatasnamakan IASC.”](https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Waspada-Penipuan-Website-Mengatasnamakan-Indonesia-Anti-Scam-Centre-IASC.aspx) 23 Mar 2025.
6. [DANA Indonesia, Google Play reviews.](https://play.google.com/store/apps/details?id=id.dana) Review dated 2 Jan 2025.
7. [Januardi & Hasya, “Crashes, Fees, and Customer Service: Theme-Level Correlates of E-Wallet App Ratings in Indonesia.”](https://irjems.org/irjems-v5i6p112.html) 2026.
8. [DJP, “Solusi atas Kondisi Teknis Pascaimplementasi Coretax DJP.”](https://pajak.go.id/sites/default/files/2025-01/Solusi%20atas%20Kondisi%20Teknis%20Pascaimplementasi%20Coretax%20DJP%20Versi%20Tanggal%2021%20Januari%202025.pdf) 21 Jan 2025.
9. [Ombudsman RI, “Banyak Dikeluhkan Pengguna, Ombudsman Ingatkan Potensi Maladministrasi pada Coretax.”](https://ombudsman.go.id/pers/r/-banyak-dikeluhkan-pengguna-ombudsman-ingatkan-potensi-maladministrasi-pada-coretax) 12 Feb 2025.
10. [Mobile JKN, Google Play reviews.](https://play.google.com/store/apps/details?hl=fr_CH&id=app.bpjs.mobile) Reviews dated 10 Jan and 17 Mar 2025.
11. [Journal of Community Health Provision, “Hospital Patient Complaints in Indonesia.”](https://www.psppjournals.org/index.php/jchp/article/download/946/967) 2025.
12. [MyTelkomsel, Google Play reviews.](https://play.google.com/store/apps/details?id=com.telkomsel.telkomselcm) Reviews dated 16 Jul 2025 and developer reply dated 17 Jul 2025.
13. [ANTARA, “APJII catat tingkat penetrasi internet Indonesia capai 80,66 persen.”](https://www.antaranews.com/berita/5019229/apjii-catat-tingkat-penetrasi-internet-indonesia-capai-8066-persen) 6 Aug 2025.
14. [Databoks/Katadata, “Gangguan Internet Utama di Indonesia: Jaringan Lambat dan Sinyal Lemah.”](https://databoks.katadata.co.id/teknologi-telekomunikasi/statistik/6a1fa3823d439/gangguan-internet-utama-di-indonesia-jaringan-lambat-dan-sinyal-lemah) 3 Jun 2026.
15. [IESR, *Indonesia Sustainable Mobility Outlook 2025*.](https://iesr.or.id/wp-content/uploads/2025/07/Indonesia-Sustainable-Mobility-Outlook-2025-IESR-2.pdf) 2025.
16. [TransJakarta, Google Play reviews.](https://play.google.com/store/apps/details?hl=en&id=com.transjakmobile) Review dated 4 Dec 2024; developer reply dated 14 Nov 2025.
17. [CIPG/Fairwork, “Hasil Survei: Pekerja Platform Terjebak Kondisi Kerja yang Buruk.”](https://cipg.or.id/blog_article/hasil-survei-pekerja-platform-terjebak-kondisi-kerja-yang-buruk/) 26 Sep 2025.
18. [Pulitzer Center, “The Power of Algorithms in Online Ride-Hailing Platforms.”](https://pulitzercenter.org/stories/power-algorithms-online-ride-hailing-platforms) 2025.
19. [Metro TV, “Mayoritas Driver Ojol Disebut Pilih Potongan 20 Persen dengan Keuntungan Lebih Banyak.”](https://www.metrotvnews.com/read/K5nC7BMA-mayoritas-driver-ojol-disebut-pilih-potongan-20-persen-dengan-keuntungan-lebih-banyak) 19 Sep 2025.
20. [ANTARA, “BPKN catat 851 aduan konsumen sepanjang 2025.”](https://www.antaranews.com/berita/5307586/bpkn-catat-851-aduan-konsumen-sepanjang-2025) 16 Dec 2025.
21. [detikProperti, “BPKN Ungkap Sederet Aduan Konsumen Perumahan.”](https://www.detik.com/properti/berita/d-7844085/bpkn-ungkap-sederet-aduan-konsumen-perumahan-apa-yang-paling-banyak) 27 Mar 2025.
22. [BPHN, apartment cancellation/refund legal consultation.](https://literasihukum.bphn.go.id/konsultasi-hukum/28951) 2 Apr 2026.
23. [Reddit, “Butuh Insight, Setahun Apply Kerja Nol Panggilan.”](https://www.reddit.com/r/indonesia/comments/1mh94h9/butuh_insight_setahun_apply_kerja_nol_panggilan/) 4 Aug 2025.
24. [DPR RI, “Indonesia Jadi Pusat Penipuan Kerja,” Info Singkat.](https://berkas.dpr.go.id/pusaka/files/info_singkat/Info%20Singkat-XVII-24-II-P3DI-Desember-2025-576-EN.pdf) Dec 2025.
25. [SMERU, *Readiness of Employers and Jobseekers to Move Online*.](https://smeru.or.id/sites/default/files/publication/wp_employers_and_jobseekers_eng_2024-10-8.pdf) 2024, used for 2025–26 interpretation of the labor-platform mechanism.
26. [MicroSave/MSC, *The landscape and financial access of social commerce sellers in Indonesia*.](https://www.microsave.net/wp-content/uploads/2025/09/Social-Commerce-Initiatives_Report_English.pdf) Sep 2025; quantitative fieldwork Aug–Dec 2024.
27. [Katadata, “Biaya di Marketplace Bisa Tembus 30%, Seller UMKM Keluhkan Margin Kian Tipis.”](https://katadata.co.id/amp/digital/e-commerce/6a0448d937533/biaya-di-marketplace-bisa-tembus-30-seller-umkm-keluhkan-margin-kian-tipis) 13 May 2026.
28. [Reddit, “Jualan Di Tokopedia rasanya makin merugi.”](https://www.reddit.com/r/indonesia/comments/1kowvgt/jualan-di-tokopedia-rasanya-makin-merugi/) 2025.
29. [Product Hunt, “Eksekut Reviews.”](https://www.producthunt.com/products/eksekut/reviews) 2025.
30. [Hacker News, “Brazil's Pix payment system faces pressure from Visa and Mastercard.”](https://news.ycombinator.com/item?id=48052371) 2026; comparative context only.
31. [Reddit r/indonesia, “Mengapa Kebanyakan sistem Pelayanan Public Indonesia tidak User Friendly?”](https://www.reddit.com/r/indonesia/comments/1j6uaq2/mengapa_kebanyakan_sistem_pelayanan_public/) 8 Mar 2025.
32. [Reddit r/indonesia, “Why did Indonesian app developers follow Chinese app design mindset?”](https://www.reddit.com/r/indonesia/comments/1ikakav/why-did-indonesian-app-developers-follow-chinese-app-design-mindset/) 8 Feb 2025.
33. [Dukcapil Tegal, “Kemendagri Rilis Update Aplikasi KTP Digital di Playstore.”](https://disdukcapil.tegalkab.go.id/berita/280-kemendagri-rilis-update-aplikasi-ktp-digital-di-playstore) 13 Jan 2025.
34. [Kompas, “Bikin KTP Digital atau IKD Masih Offline di Kantor Dukcapil.”](https://amp.kompas.com/tren/read/2025/02/23/153000165/bikin-ktp-digital-atau-ikd-masih-offline-di-kantor-dukcapil-ini-kata-ditjen) 23 Feb 2025.
35. [PLN Mobile, Google Play reviews.](https://play.google.com/store/apps/details?id=com.icon.pln123) Reviews dated Jul–Aug 2026.
36. [Reddit r/WkwkwkLand, “Customer Service PLN.”](https://www.reddit.com/r/WkwkwkLand/comments/1luks9y/customer_service_pln/) 8 Jul 2025.
37. [Reddit r/bali, “PDAM water has been off for 2 weeks?”](https://www.reddit.com/r/bali/comments/1uuyu73/pdam_water_has_been_off_for_2_weeks/) 13 Jul 2026.
38. [Adnyana & Purba, “Analisis Kualitas Layanan Operasional Jasa Ekspedisi J&T Express Berdasarkan Ulasan Pengguna Aplikasi.”](https://journal.ilmudata.co.id/index.php/RIGGS/article/view/4477) 2026; review window Jan–Nov 2025.
39. [PosAja, Google Play reviews.](https://play.google.com/store/apps/details?hl=id&id=com.posindonesia.cob) Reviews dated Aug 2025 and Jul 2026.
40. [YouGov, “Booking burnout: Indonesia travel stress report 2025.”](https://yougov.com/reports/51563-id-travel-stress-report-2025) 25 Feb 2025.
41. [Traveloka, Google Play reviews.](https://play.google.com/store/apps/details/Traveloka_Hotel_Flight?hl=id&id=com.traveloka.android) Reviews dated Apr–Sep 2026.
42. [Trustpilot, Traveloka customer reviews.](https://www.trustpilot.com/review/traveloka.co.id) Reviews dated Mar 2025–Jul 2026.
43. [Jurnal SIMADA, “Penerapan Text Mining untuk Analisis Topik Keluhan Pengguna Aplikasi Access by KAI.”](https://journal.darmajaya.ac.id/index.php/SIMADA/article/view/1339) 2026.
44. [Reddit r/Jakarta, “Questions about KAI refund, safety at night, running.”](https://www.reddit.com/r/Jakarta/comments/1s7pul0/questions_about_kai_refund_safety_at_night_running/) 30 Mar 2026.
45. [Gojek, App Store reviews.](https://apps.apple.com/us/app/gojek/id944875099?see-all=reviews) Review dated 19 Sep 2025 and developer reply dated 21 Sep 2025.
46. [Reddit r/indonesia, “Kalian ada masalah gak sama aplikasi provider Indo?”](https://www.reddit.com/r/indonesia/comments/1m9r5mig/kalian_ada_masalah_gak_sama_aplikasi_provider_indo/) 26 Jul 2025.
47. [Reddit r/indonesia, “Pengalaman lapor masalah Flazz di GoPay.”](https://www.reddit.com/r/indonesia/comments/1jagh10/pengalaman_lapor_masalah_flazz_di_gopay/) 13 Mar 2025.
48. [BCA Mobile, Google Play reviews.](https://play.google.com/store/apps/details?hl=fr&id=com.bca) Review dated 23 Oct 2025.
49. [Reddit r/indonesia, banking-app discussion.](https://www.reddit.com/r/indonesia/comments/1tk1y03/removed/) 21–27 May 2026.
50. [OJK, “Siaran Pers: Sektor Jasa Keuangan Terjaga Stabil…”](https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/RDKB-Juni-2025.aspx) June 2025.
51. [The Jakarta Post, “Fraud and other risks still holding back P2P lending business.”](https://www.thejakartapost.com/business/2025/02/09/fraud-and-other-risks-still-holding-back-p2p-lending-business) 9 Feb 2025.
52. [Reddit r/indonesia, illegal-loan debt-collection account.](https://www.reddit.com/r/indonesia/comments/1mlciw8/im_really_scared_because_my_parents_heavily_pressured_me_to_use_pinjol/) 9 Aug 2025.
53. [OJK, “Stabilitas Sektor Jasa Keuangan…” BNPL data.](https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/RDKB-Februari-2025.aspx) Feb 2025.
54. [Katadata/CELIOS, “Tadpole Menggerus Pelindungan Konsumen.”](https://katadata.co.id/digital/fintech/694220c548ab3/tadpole-menggerus-pelindungan-konsumen) Dec 2025.
55. [BBPOM Serang, “Semester I 2025… 123 Produk Ilegal di Platform Online.”](https://serang.pom.go.id/berita/semester-i-2025-bbpom-serang-temukan-123-produk-ilegal-di-platform-online) 8 Jul 2025.
56. [BPOM Siber, marketplace cyber-patrol monitoring Q3 2025.](https://siber.pom.go.id/berita/bpom-berkoordinasi-dengan-idea-dan-marketplace-melaksanakan-monitoring-dan-evaluasi-patroli-siber-triwulan-iii-2025) Oct 2025.
57. [Ombudsman, “Pungutan Bukan Solusi Pembangunan di Dunia Pendidikan.”](https://ombudsman.go.id/artikel/r/artikel--pungutan-bukan-solusi-pembangunan-di-dunia-pendidikan) 6 Aug 2026.
58. [Ombudsman, SPMB warning on unauthorized charges.](https://ombudsman.go.id/pers/r/awasi-spmb-ombudsman-ingatkan-pungutan-di-luar-ketentuan-harus-dikembalikan) 2025.
59. [Bojonegoro local report, “Warga Mengeluh Sekolah Masih Bayar, Bayar, Bayar.”](https://bojonegoro.inews.id/read/583533/bojonegoro-daerah-kaya-tapi-warga-mengeluh-sekolah-masih-bayar-bayar) 17 Apr 2025.
60. [Investing in Women, “Care Economy in Indonesia.”](https://investinginwomen.asia/wp-content/uploads/2025/03/Investing-in-Women-The-Care-Economy-in-Indonesia-March-2025_final.pdf) Mar 2025.
61. [Reddit r/indonesia, government daycare discussion.](https://www.reddit.com/r/indonesia/comments/1rd5d45/mencari_daycare_layak_milik_pemerintah_di_jakarta/) 24 Feb 2026.
62. [ETH Zurich, “Jakarta’s Air: What People Think and Want.”](https://ib.ethz.ch/research/current-projects/air-pollution/what-people-think/jakarta.html) 2025 survey.
63. [Reddit r/indonesia, “What’s up with the air here?”](https://www.reddit.com/r/indonesia/comments/1utwu6j/whats_up_with_the_air_here/) 11 Jul 2026.
64. [Databoks/PP17, environmental priorities Q2 2025.](https://databoks.katadata.co.id/lingkungan/statistik/6848f71c7388a/daftar-masalah-lingkungan-yang-jadi-prioritas-warga-indonesia-kuartal-ii-2025) Survey fieldwork 12–15 May 2025.
65. [Bisnis.com, “Petani Keluhkan Ketidakpastian Harga Sawit dan Penertiban Lahan.”](https://ekonomi.bisnis.com/read/20250624/12/1887792/petani-keluhkan-ketidakpastian-harga-sawit-dan-penertiban-lahan) 24 Jun 2025.
66. [East Java farmer-welfare study.](https://arxiv.org/abs/2501.08601) 15 Jan 2025.
67. [Social Sciences & Humanities Open, “Seller intentions to switch for quick response code payment in culinary sector.”](https://doi.org/10.1016/j.ssaho.2026.102691) 2026.
68. [South Jakarta micro-merchant digital-payment study.](https://jurnal.unived.ac.id/index.php/er/article/view/7190) 14 Apr 2025.
69. [Atradius, “B2B payment practices trends in Indonesia 2025.”](https://group.atradius.com/knowledge-and-research/reports/b2b-payment-practices-trends-indonesia-2025) 2025.
70. [GoodStats, “Badai PHK pada 2025, 67% Publik Jadi Korbannya.”](https://data.goodstats.id/statistic/badai-phk-pada-2025-67-publik-jadi-korbannya-XVhlQ) Survey/FGD 3 Jun–3 Jul 2025.
71. [Ipsos, “What Worries Indonesia H1 2025.”](https://www.ipsos.com/sites/default/files/ct/news/documents/2025-10/WHAT%20WORRIES%20INDONESIA_H1%202025.pdf) 2025.
72. [Reddit r/indotech, “YouTuber di RI Makin Susah…”](https://www.reddit.com/r/indotech/comments/1ofzsrn/youtuber_di_ri_makin_susah_pendapatan_turun_drastis_gara_gara_ini/) 25 Oct 2025.
73. [Reddit r/indonesia, Facebook creator monetization discussion.](https://www.reddit.com/r/indonesia/comments/1u90ox7/facebook_creator_monetization_surge_led_by_indonesia/) 2026.
74. [Kementerian Hukum, royalties and AI governance discussion with YouTube.](https://kemenkum.go.id/component/content/article/kemenkum-bertemu-youtube-bahas-royalti-hingga-tata-kelola-ai?Itemid=&catid=19&highlight=WzIwMjZd) 27 Jan 2026.
75. [IDWF, “Indonesia Report and Highlights.”](https://idwfed.org/wp-content/uploads/2025/05/Indonesia-Report-and-Highlights.pdf) May 2025.
76. [Tirto, “YLKI Catat Terima 1.977 Pengaduan Konsumen Sepanjang 2025.”](https://tirto.id/ylki-catat-terima-1977-pengaduan-konsumen-sepanjang-2025-hpgd) 14 Jan 2026.
77. [Ombudsman RI, “Ombudsman RI Terima 23.596 Aduan Sepanjang 2025.”](https://ombudsman.go.id/pers/r/ombudsman-ri-terima-23596-aduan-sepanjang-2025-tegaskan-warisan-pengawasan-berdampak-di-akhir-masa-jabatan-2021-2026) 20 Feb 2026.
78. [Fanda et al., “Managing medicines in decentralization: discrepancies between national policies and local practices in primary healthcare settings in Indonesia.”](https://pure.eur.nl/en/publications/managing-medicines-in-decentralization-discrepancies-between-nati/) 1 Apr 2025; interviews with 56 health workers.
79. [Reddit r/indonesia, “My boss blatantly said, ‘we have no more money to pay you’.”](https://www.reddit.com/r/indonesia/comments/1jhc3rs/) 22 Mar 2025.
80. [Reddit r/indonesia, “Suami-Istri gugat aturan sisa kuota internet hangus.”](https://www.reddit.com/r/indonesia/comments/1q06qk4/suamiistri_gugat_aturan_sisa_kouta_internet/) 31 Dec 2025.
81. [Reddit r/indonesia, “kenapa semua harus online bukan optional?”](https://www.reddit.com/r/indonesia/comments/1lje5j4) 24 Jun 2025.
82. [Reddit r/indonesia, “Apapun Masalahnya Salah Gen Z” payment discussion.](https://www.reddit.com/r/indonesia/comments/1prypnz/apapun_masalahnya_salah_gen_z/) 21 Dec 2025.
83. [Reddit r/indonesia, “Harus dibayar nggak ini?” parcel handoff discussion.](https://www.reddit.com/r/indonesia/comments/1kcvadr/harus-dibayar-nggak-ini/) 2 May 2025.
84. [Bank Indonesia, consumer complaint and dispute-resolution flow.](https://www.bi.go.id/en/pelindungan-konsumen/adukan-kendala/default.aspx) Current workflow used in 2025–26.
85. [OJK, July 2026 Board of Commissioners / consumer-service data.](https://institute.ojk.go.id/iru/WebSite/ArticleList/View/1043_The_Indonesia_Financial_Services_Authority_Board_of_Commissioners_Meeting:_Maintaining_Financial_Sector_Resilience_to_Support_Development_and_Financial_Sector_Strength) 2026.
86. [Reddit r/finansial, “Saldo RDN Nyangkut.”](https://www.reddit.com/r/finansial/comments/1qksubx/saldo_rdn_nyangkut/) 23 Jan 2026.
87. [Reddit r/indonesia, “lupa bayar paylater 10.000, denda telatnya 50.000.”](https://www.reddit.com/r/indonesia/comments/1t2gj9q/dont_be_like_me_lupa_bayar_paylater_10000_denda/) 3 May 2026.
88. [StartupIndonesia, “Saat AI jadi tempat curhat, sejumlah startup melirik peluang.”](https://startupindonesia.id/newsletter/saat-ai-jadi-tempat-curhat-sejumlah-startup-melirik-peluang) 2025.
89. [McKinsey, “Connecting patients to healthcare: a conversation with Halodoc’s Jonathan Sudharta.”](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/connecting-patients-to-healthcare-a-conversation-with-halodocs-jonathan-sudharta) 4 Feb 2025.
90. [TechCrunch, “Pintarnya raises $16.7M to power jobs and financial services in Indonesia.”](https://techcrunch.com/2025/08/24/pintarnya-raises-16-7m-to-power-jobs-and-financial-services-in-indonesia/) 24 Aug 2025.
91. [Reddit r/IndoParenting, “Susahnya cari info biaya TK di Jakarta.”](https://www.reddit.com/r/IndoParenting/comments/1u4mwke/susahnya_cari_info_biaya_tk_di_jakarta_hampir/) Jun 2026.
92. [DetikEdu, “Survei: Orang RI Menilai Ketimpangan Akses Jadi Tantangan Utama Pendidikan.”](https://www.detik.com/edu/sekolah/d-8314463/survei-orang-ri-menilai-ketimpangan-akses-jadi-tantangan-utama-pendidikan) 20 Jan 2026; reporting Ipsos Education Monitor 2025.
93. [ANTARA Bali, “Penyandang disabilitas ingin Trans Metro Dewata beroperasi lagi.”](https://bali.antaranews.com/berita/366194/penyandang-disabilitas-ingin-trans-metro-dewata-beroperasi-lagi) 2 Jan 2025.
94. [Kompas, “Ekonomi Enggano Lumpuh, Warga Barter Ikan demi Beras.”](https://regional.kompas.com/read/2025/06/19/084635878/ekonomi-enggano-lumpuh-warga-barter-ikan-demi-beras?page=all) 19 Jun 2025.
95. [SBS Indonesian, “Survey result in Indonesia shows cost of living defeats corruption eradication issue.”](https://www.sbs.com.au/language/indonesian/en/podcast-episode/cost-of-living-defeats-corruption-eradication-issue/vobfb5k77) 19 Jul 2025; Roy Morgan interviews Oct 2024–Mar 2025.
96. [Product Hunt, “Kita: Turn documents into signals for lenders.”](https://www.producthunt.com/products/kita) 2026.
97. [Mercu Buana Repository, “Strategi Komunikasi Penanganan Keluhan Konsumen di Perusahaan Startup Digital: Studi Kasus pada Customer Service PT Tokopedia Indonesia.”](https://repository.mercubuana.ac.id/94623/) deposited 4 Mar 2025.
98. [OJK, “July 2026 Board of Commissioners Meeting: Consumer Services and IASC Data.”](https://institute.ojk.go.id/iru/WebSite/ArticleList/View/1043_The_Indonesia_Financial_Services_Authority_Board_of_Commissioners_Meeting:_Maintaining_Financial_Sector_Resilience_to_Support_Development_and_Financial_Sector_Strength) 2026.
99. [OJK, “Satgas PASTI Terima 25 Ribu Pengaduan Aktivitas Keuangan Ilegal dan IASC Berhasil Blokir Dana Terkait Scam Rp724 Miliar.”](https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Satgas-PASTI-Terima-25-Ribu-Pengaduan-Aktivitas-Keuangan-Ilegal-dan-IASC-Berhasil-Blokir-Dana-Terkait-Scam-Rp-724-Miliar.aspx) 1 Sep 2026.
100. [Bank Indonesia, “Adukan Kendala” consumer complaint flow.](https://www.bi.go.id/id/pelindungan-konsumen/adukan-kendala/default.aspx) accessed 2026.
101. [Kumparan, “Survei: 6 dari 10 Konsumen E-Commerce RI Alami Kendala di Fase Pasca-Pembelian.”](https://kumparan.com/kumparantech/survei-6-dari-10-konsumen-e-commerce-ri-alami-kendala-di-fase-pasca-pembelian-25mbl2zuF2k) 2025.
102. [ScienceDirect, “Factors influencing adoption of e-payments by microenterprises’ owners in Indonesia.”](https://www.sciencedirect.com/org/science/article/pii/S1746566425000198) 28 Jul 2025; survey of 250 microenterprise owners and focus groups.
103. [Tedjomurti & Arofah, “Social Construction of Traditional MSME Actors Towards QRIS Digital Payment Adoption in Surabaya.”](https://journal.unesa.ac.id/index.php/jsdg/article/view/43196) 2025; interviews with five MSME actors.
104. [Social Sciences & Humanities Open, “Seller intentions to switch for quick response code payment in culinary sector.”](https://doi.org/10.1016/j.ssaho.2026.102691) 2026; survey of 237 culinary MSMEs.
105. [Sitompul, “Digital Transformation and the Risk of Exclusion: Implementation of the Mobile JKN Online Queueing System.”](https://jurnal.uinsu.ac.id/index.php/psga/article/view/29448) 2026; interviews, direct observation, and document review.
106. [Fairwork Indonesia, “Labour Standards in the Platform Economy.”](https://fair.work/wp-content/uploads/sites/17/2025/09/Fairwork-Indonesia-Report-2025_FINAL.pdf) 2025; worker interviews and survey evidence.
107. [Ombudsman RI, “Perlindungan terhadap Kepastian Hak Kepemilikan Rumah.”](https://ombudsman.go.id/news/news/r/ombudsman-ri-tegaskan-perlindungan-terhadap-kepastian-hak-kepemilikan-rumah) 24 Mar 2025.
108. [Kementerian PKP, “Kanal Pengaduan Konsumen Perumahan Terpadu BENAR-PKP.”](https://pkp.go.id/berita/detail/kementerian-pkp-luncurkan-kanal-pengaduan-konsumen-perumahan-terpadu-benar-pkp) 26 Mar 2025.
109. [“Challenges And Opportunities: A Netnographic Study Of The Perceptions Of Fintech E-Wallet Users In Indonesia.”](https://www.researchgate.net/publication/400854170_Challenges_And_Opportunities_A_Netnographic_Study_Of_The_Perceptions_Of_Fintech_E-Wallet_Users_In_Indonesia) 2026; 500 February 2025 user reviews.
110. [IPB Repository, “Pembuatan Modul Verifikasi Data Nasabah untuk Branch Manager pada Website Digital Lending.”](https://repository.ipb.ac.id/handle/123456789/165342) 2025.
111. [Kementerian Perdagangan, 2025 consumer complaint totals reported by detikFinance.](https://finance.detik.com/berita-ekonomi-bisnis/d-8340136/kemendag-terima-7-887-aduan-sepanjang-2025-ini-paling-banyak-dikeluhkan/amp) 4 Feb 2026.
