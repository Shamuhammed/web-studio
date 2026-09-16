const PACKAGES = {
    landing: {
        id: 'landing',
        label: 'Одностраничный сайт под заявки',
        price: 850,
        days: [7, 10],
        volume: {
            included: 8,
            extraPrice: 80,
            extraDays: 1,
            extraDaysPer: 0,
            unit: 'блоков',
        },
        includedAddons: [],
    },
    business: {
        id: 'business',
        label: 'Сайт компании с разделами',
        price: 1650,
        days: [15, 22],
        volume: {
            included: 15,
            extraPrice: 90,
            extraDays: 1,
            extraDaysPer: 0,
            unit: 'разделов',
        },
        includedAddons: ['i18n', 'crm', 'belgie'],
    },
    ecommerce: {
        id: 'ecommerce',
        label: 'Каталог и продажа на сайте',
        price: 2650,
        days: [25, 35],
        volume: {
            included: 100,
            extraPrice: 12,
            extraDays: 0,
            extraDaysPer: 50,
            unit: 'позиций',
        },
        includedAddons: ['crm', 'payments', 'belgie'],
    },
};

const ADDONS = {
    design: { label: 'Свой дизайн, не шаблонный вид', price: 500, days: 3 },
    i18n: { label: 'Версия сайта на втором языке', price: 350, days: 3 },
    crm: { label: 'Заявки сразу в вашу CRM', price: 400, days: 2 },
    payments: { label: 'Оплата на сайте', price: 250, days: 2 },
    belgie: { label: 'Регистрация сайта по правилам РБ', price: 150, days: 1 },
};

const RETAINERS = {
    none: { label: 'Без ежемесячного сопровождения', price: 0, adsBudget: false },
    support: { label: 'Присмотр за сайтом', price: 250, adsBudget: false },
    ads: { label: 'Реклама, чтобы заявки пошли быстрее', price: 450, adsBudget: true },
    seo: { label: 'Продвижение в поиске', price: 750, adsBudget: false },
    complex: { label: 'Реклама, поиск и ведение сайта', price: 1200, adsBudget: true },
};

const QUESTIONS = [
    {
        id: 'need',
        title: 'Что сайт должен делать для бизнеса?',
        hint: 'Выберите ситуацию, которая ближе всего. Термины не нужны.',
        options: [
            {
                id: 'leads',
                label: 'Собирать заявки и звонки',
                detail: 'Одна продающая страница: кто вы, чем полезны, кнопка «оставить заявку».',
            },
            {
                id: 'company',
                label: 'Показать компанию и услуги',
                detail: 'Несколько разделов: услуги, о компании, контакты, возможно кейсы.',
            },
            {
                id: 'shop',
                label: 'Продавать товары на сайте',
                detail: 'Каталог, корзина и оплата — клиент выбирает и покупает сам.',
            },
        ],
    },
    {
        id: 'pay',
        title: 'Как клиент будет оставлять деньги или заявку?',
        hint: 'Если пока не уверены — берите заявку. Оплату можно добавить позже.',
        show: (answers) => answers.need && answers.need !== 'shop',
        options: [
            {
                id: 'request',
                label: 'Заявка, звонок или сообщение',
                detail: 'Форма на сайте, уведомление вам в мессенджер.',
            },
            {
                id: 'online',
                label: 'Хочу, чтобы можно было оплатить на сайте',
                detail: 'Карта, ЕРИП и похожие способы — без звонка менеджеру.',
            },
        ],
    },
    {
        id: 'scope',
        title: 'Насколько большой получится сайт?',
        hint: 'Ориентир, не точная смета. На брифе уточним.',
        show: (answers) => Boolean(answers.need),
        options: (answers) => {
            if (answers.need === 'shop') {
                return [
                    { id: 'base', label: 'До 100 позиций', detail: 'Небольшой каталог, старт продаж.' },
                    { id: 'mid', label: 'Около 100–200 позиций', detail: 'Средний ассортимент, категории уже нужны.' },
                    { id: 'large', label: 'До 400 позиций', detail: 'Широкая линейка, больше фильтров и страниц.' },
                ];
            }

            if (answers.need === 'company') {
                return [
                    { id: 'base', label: 'Основное: услуги, о нас, контакты', detail: 'Типичный сайт компании, до 15 разделов.' },
                    { id: 'more', label: 'Много направлений, филиалов или кейсов', detail: 'Больше страниц, чем в базовом тарифе.' },
                ];
            }

            return [
                { id: 'base', label: 'Коротко: кто мы и как оставить заявку', detail: 'Несколько блоков на одной странице.' },
                { id: 'more', label: 'Подробно: много блоков и смыслов', detail: 'Длинная страница, сверх базового объёма.' },
            ];
        },
    },
    {
        id: 'geo',
        title: 'Где ваши клиенты?',
        hint: 'От этого зависит регистрация сайта в Беларуси и нужен ли второй язык.',
        options: [
            {
                id: 'by',
                label: 'В основном в Беларуси',
                detail: 'Один язык. Сайт нужно оформить по требованиям РБ.',
            },
            {
                id: 'multi',
                label: 'Беларусь и другие страны',
                detail: 'Нужна версия на втором языке и оформление по правилам РБ.',
            },
        ],
    },
    {
        id: 'crm',
        title: 'Куда должны попадать заявки?',
        hint: 'Если работаете в чатах — так и оставляем. CRM подключим, если она уже есть или нужна.',
        options: [
            {
                id: 'chat',
                label: 'В мессенджер, почту или таблицу',
                detail: 'Проще на старте: заявка приходит вам в Telegram или на email.',
            },
            {
                id: 'crm',
                label: 'В CRM, чтобы ничего не терялось',
                detail: 'Битрикс24, amoCRM и похожие системы — заявки сразу в воронку.',
            },
        ],
    },
    {
        id: 'design',
        title: 'Насколько уникальным должен быть вид?',
        hint: 'Оба варианта выглядят современно. Разница — в «своём лице» бренда.',
        options: [
            {
                id: 'ready',
                label: 'Достаточно аккуратного современного сайта',
                detail: 'Соберём сильный вид без отдельного дизайн-концепта.',
            },
            {
                id: 'custom',
                label: 'Нужен узнаваемый стиль, не «как у всех»',
                detail: 'Сначала концепт дизайна, потом вёрстка.',
            },
        ],
    },
    {
        id: 'traffic',
        title: 'Откуда клиенты должны приходить после запуска?',
        hint: 'Сайт сам по себе заявки не приводит. Это про работу после сдачи.',
        options: [
            {
                id: 'none',
                label: 'Пока сами: сарафан, старые клиенты',
                detail: 'Можно без ежемесячного продвижения.',
            },
            {
                id: 'ads',
                label: 'Нужны заявки быстрее — через рекламу',
                detail: 'Яндекс и Google. Рекламный бюджет отдельно.',
            },
            {
                id: 'seo',
                label: 'Чтобы находили в поиске через месяцы',
                detail: 'Статьи, техническое продвижение, отчёты по позициям.',
            },
            {
                id: 'both',
                label: 'И реклама, и поиск, и ведение',
                detail: 'Комплекс: не хотите сами собирать каналы.',
            },
        ],
    },
    {
        id: 'care',
        title: 'Кто будет следить, чтобы сайт не «упал»?',
        hint: 'Обновления, копии, мелкие правки. Имеет смысл, если продвижение пока не берёте.',
        show: (answers) => answers.traffic === 'none',
        options: [
            {
                id: 'yes',
                label: 'Пусть студия присматривает',
                detail: 'Резервные копии, обновления, до 3 часов правок в месяц.',
            },
            {
                id: 'no',
                label: 'Пока разберёмся сами',
                detail: 'Поддержку можно подключить позже.',
            },
        ],
    },
];

function formatByn(value) {
    return `${new Intl.NumberFormat('ru-RU').format(value)} BYN`;
}

function getQuestionOptions(question, answers) {
    return typeof question.options === 'function' ? question.options(answers) : question.options;
}

function isQuestionVisible(question, answers) {
    return question.show ? question.show(answers) : true;
}

function visibleQuestions(answers) {
    return QUESTIONS.filter((question) => isQuestionVisible(question, answers));
}

function answersToQuote(answers, skippedAddons = []) {
    let packageId = 'landing';

    if (answers.need === 'company') {
        packageId = 'business';
    }

    if (answers.need === 'shop') {
        packageId = 'ecommerce';
    }

    const pkg = PACKAGES[packageId];
    let volume = pkg.volume.included;

    if (packageId === 'landing' && answers.scope === 'more') {
        volume = 12;
    }

    if (packageId === 'business' && answers.scope === 'more') {
        volume = 25;
    }

    if (packageId === 'ecommerce') {
        if (answers.scope === 'mid') {
            volume = 200;
        } else if (answers.scope === 'large') {
            volume = 400;
        } else {
            volume = 100;
        }
    }

    const requested = [];

    if (answers.pay === 'online' || answers.need === 'shop') {
        requested.push('payments');
    }

    if (answers.geo === 'by' || answers.geo === 'multi') {
        requested.push('belgie');
    }

    if (answers.geo === 'multi') {
        requested.push('i18n');
    }

    if (answers.crm === 'crm') {
        requested.push('crm');
    }

    if (answers.design === 'custom') {
        requested.push('design');
    }

    const uniqueRequested = [...new Set(requested)];
    const includedShown = uniqueRequested.filter((id) => pkg.includedAddons.includes(id));
    const addonIds = uniqueRequested.filter(
        (id) => !pkg.includedAddons.includes(id) && !skippedAddons.includes(id),
    );

    let retainerId = 'none';

    if (answers.traffic === 'ads') {
        retainerId = 'ads';
    } else if (answers.traffic === 'seo') {
        retainerId = 'seo';
    } else if (answers.traffic === 'both') {
        retainerId = 'complex';
    } else if (answers.traffic === 'none' && answers.care === 'yes') {
        retainerId = 'support';
    }

    const extraVolume = Math.max(0, volume - pkg.volume.included);
    const extraVolumePrice = extraVolume * pkg.volume.extraPrice;
    const addonsPrice = addonIds.reduce((sum, id) => sum + ADDONS[id].price, 0);
    let extraDays = 0;

    if (pkg.volume.extraDaysPer) {
        extraDays += Math.ceil(extraVolume / pkg.volume.extraDaysPer);
    } else {
        extraDays += extraVolume * (pkg.volume.extraDays || 0);
    }

    extraDays += addonIds.reduce((sum, id) => sum + ADDONS[id].days, 0);

    const retainer = RETAINERS[retainerId];

    return {
        packageId,
        pkg,
        volume,
        extraVolume,
        extraVolumePrice,
        addonIds,
        includedShown,
        addonsPrice,
        retainerId,
        retainer,
        oneTime: pkg.price + extraVolumePrice + addonsPrice,
        monthly: retainer.price,
        days: [pkg.days[0], pkg.days[1] + extraDays],
        ready: Boolean(answers.need),
    };
}

function buildBreakdown(quote) {
    const lines = [{ label: quote.pkg.label, value: formatByn(quote.pkg.price) }];

    if (quote.extraVolume > 0) {
        lines.push({
            label: `Больше объёма, чем в тарифе (+${quote.extraVolume} ${quote.pkg.volume.unit})`,
            value: formatByn(quote.extraVolumePrice),
        });
    }

    quote.addonIds.forEach((id) => {
        lines.push({
            label: ADDONS[id].label,
            value: formatByn(ADDONS[id].price),
        });
    });

    quote.includedShown.forEach((id) => {
        lines.push({
            label: `${ADDONS[id].label} — уже в этом варианте`,
            value: '0 BYN',
        });
    });

    if (quote.monthly > 0) {
        lines.push({
            label: `${quote.retainer.label} / мес.`,
            value: `${formatByn(quote.monthly)}/мес.`,
        });
    }

    return lines;
}

function buildWhy(answers, quote) {
    if (!answers.need) {
        return 'Ответьте на первый вопрос — справа появится ориентир по цене.';
    }

    const bits = [quote.pkg.label];

    if (answers.pay === 'online' && quote.packageId !== 'ecommerce') {
        bits.push('оплата на сайте');
    }

    if (answers.geo === 'multi') {
        bits.push('второй язык');
    }

    if (answers.crm === 'crm' && !quote.pkg.includedAddons.includes('crm')) {
        bits.push('заявки в CRM');
    }

    if (answers.design === 'custom') {
        bits.push('свой дизайн');
    }

    if (quote.retainerId !== 'none') {
        bits.push(quote.retainer.label.toLowerCase());
    }

    return `По вашим ответам закладываем: ${bits.join(', ')}. Это ориентир, не договор.`;
}

function buildEstimateText(quote, answers) {
    const lines = [
        'Ориентир из подбора на сайте (не конфиг-калькулятор).',
        `Вариант: ${quote.pkg.label}`,
        `Разово: ${formatByn(quote.oneTime)}`,
        `Ежемесячно: ${quote.monthly > 0 ? `${formatByn(quote.monthly)}/мес.` : 'нет'}`,
        `Срок: ${quote.days[0]}–${quote.days[1]} дней`,
    ];

    if (answers.need) {
        lines.push(`Задача сайта: ${QUESTIONS[0].options.find((item) => item.id === answers.need)?.label || ''}`);
    }

    quote.addonIds.forEach((id) => {
        lines.push(`+ ${ADDONS[id].label}`);
    });

    if (quote.retainerId !== 'none') {
        lines.push(`Сопровождение: ${quote.retainer.label}`);
    }

    if (quote.retainer.adsBudget) {
        lines.push('Рекламный бюджет в сумму не входит.');
    }

    return lines.join('\n');
}

function applyEstimateToContact(quote, answers) {
    const typeField = document.querySelector('#site-type');
    const messageField = document.querySelector('#message');

    if (typeField) {
        typeField.value = quote.packageId;
    }

    if (messageField) {
        messageField.value = buildEstimateText(quote, answers);
    }
}

function createOptionButton(option, selected) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.guideOption = option.id;
    button.className = selected
        ? 'w-full rounded-xl border-2 border-brand bg-indigo-50 p-4 text-left'
        : 'w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-brand';

    const title = document.createElement('span');
    title.className = 'block font-semibold text-slate-900';
    title.textContent = option.label;

    const detail = document.createElement('span');
    detail.className = 'mt-1 block text-sm text-slate-600';
    detail.textContent = option.detail;

    button.append(title, detail);
    return button;
}

export function initCalculatorGuide() {
    const root = document.querySelector('#calculator-guide');

    if (!root) {
        return;
    }

    const answers = {};
    const skippedAddons = [];
    let stepIndex = 0;
    let finished = false;

    const progressEl = root.querySelector('[data-guide-progress]');
    const titleEl = root.querySelector('[data-guide-title]');
    const hintEl = root.querySelector('[data-guide-hint]');
    const optionsEl = root.querySelector('[data-guide-options]');
    const extrasEl = root.querySelector('[data-guide-extras]');
    const backBtn = root.querySelector('[data-guide-back]');
    const restartBtn = root.querySelector('[data-guide-restart]');
    const whyEl = root.querySelector('[data-guide-why]');
    const oneTimeEl = root.querySelector('[data-guide-one-time]');
    const monthlyEl = root.querySelector('[data-guide-monthly]');
    const daysEl = root.querySelector('[data-guide-days]');
    const adsNoteEl = root.querySelector('[data-guide-ads-note]');
    const listEl = root.querySelector('[data-guide-breakdown]');
    const emptyEl = root.querySelector('[data-guide-empty]');
    const totalsEl = root.querySelector('[data-guide-totals]');

    function currentQuestion() {
        return visibleQuestions(answers)[stepIndex];
    }

    function pruneAnswersFrom(questionId) {
        const start = QUESTIONS.findIndex((question) => question.id === questionId);

        QUESTIONS.slice(start + 1).forEach((question) => {
            delete answers[question.id];
        });
    }

    function renderSummary() {
        const quote = answersToQuote(answers, skippedAddons);

        if (whyEl) {
            whyEl.textContent = buildWhy(answers, quote);
        }

        if (!quote.ready) {
            emptyEl?.classList.remove('hidden');
            totalsEl?.classList.add('hidden');
            listEl?.replaceChildren();
            return quote;
        }

        emptyEl?.classList.add('hidden');
        totalsEl?.classList.remove('hidden');

        if (oneTimeEl) {
            oneTimeEl.textContent = formatByn(quote.oneTime);
        }

        if (monthlyEl) {
            monthlyEl.textContent = quote.monthly > 0 ? `${formatByn(quote.monthly)}/мес.` : '0 BYN';
        }

        if (daysEl) {
            daysEl.textContent = `${quote.days[0]}–${quote.days[1]} дней`;
        }

        adsNoteEl?.classList.toggle('hidden', !quote.retainer.adsBudget);

        if (listEl) {
            listEl.replaceChildren(
                ...buildBreakdown(quote).map((line) => {
                    const item = document.createElement('li');
                    item.className = 'flex justify-between gap-4 text-sm text-slate-600';

                    const name = document.createElement('span');
                    name.textContent = line.label;

                    const price = document.createElement('span');
                    price.className = 'shrink-0 font-medium text-slate-800';
                    price.textContent = line.value;

                    item.append(name, price);
                    return item;
                }),
            );
        }

        return quote;
    }

    function renderExtras(quote) {
        extrasEl?.replaceChildren();

        if (!finished || !extrasEl || quote.addonIds.length + skippedAddons.length === 0) {
            extrasEl?.classList.add('hidden');
            return;
        }

        extrasEl.classList.remove('hidden');

        const heading = document.createElement('p');
        heading.className = 'mb-3 text-sm font-medium text-slate-800';
        heading.textContent = 'Можно убрать из ориентира то, что пока не нужно:';
        extrasEl.append(heading);

        const optionalIds = [...new Set([...quote.addonIds, ...skippedAddons])];

        optionalIds.forEach((id) => {
            const label = document.createElement('label');
            label.className = 'mb-2 flex cursor-pointer items-start gap-2 text-sm text-slate-700';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'mt-1 accent-brand';
            input.checked = !skippedAddons.includes(id);
            input.addEventListener('change', () => {
                const index = skippedAddons.indexOf(id);

                if (input.checked && index >= 0) {
                    skippedAddons.splice(index, 1);
                }

                if (!input.checked && index < 0) {
                    skippedAddons.push(id);
                }

                render();
            });

            const text = document.createElement('span');
            text.textContent = `${ADDONS[id].label} — ${formatByn(ADDONS[id].price)}`;

            label.append(input, text);
            extrasEl.append(label);
        });
    }

    function render() {
        const questions = visibleQuestions(answers);
        const quote = renderSummary();

        if (finished) {
            if (progressEl) {
                progressEl.textContent = 'Подбор готов';
            }

            if (titleEl) {
                titleEl.textContent = 'Вот что имеет смысл заложить';
            }

            if (hintEl) {
                hintEl.textContent = 'Это не счёт. На созвоне зафиксируем состав и цену в договоре.';
            }

            optionsEl?.replaceChildren();
            renderExtras(quote);
            backBtn?.classList.remove('hidden');
            restartBtn?.classList.remove('hidden');
            return;
        }

        extrasEl?.classList.add('hidden');
        extrasEl?.replaceChildren();
        restartBtn?.classList.add('hidden');

        const question = questions[stepIndex];

        if (!question) {
            finished = true;
            render();
            return;
        }

        if (progressEl) {
            progressEl.textContent = `Вопрос ${stepIndex + 1} из ${questions.length}`;
        }

        if (titleEl) {
            titleEl.textContent = question.title;
        }

        if (hintEl) {
            hintEl.textContent = question.hint;
        }

        const options = getQuestionOptions(question, answers);
        optionsEl?.replaceChildren(
            ...options.map((option) => createOptionButton(option, answers[question.id] === option.id)),
        );

        backBtn?.classList.toggle('hidden', stepIndex === 0);
    }

    optionsEl?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-guide-option]');
        const question = currentQuestion();

        if (!button || !question || finished) {
            return;
        }

        pruneAnswersFrom(question.id);
        skippedAddons.length = 0;
        answers[question.id] = button.dataset.guideOption;

        const nextQuestions = visibleQuestions(answers);

        if (stepIndex >= nextQuestions.length - 1) {
            finished = true;
        } else {
            stepIndex += 1;
        }

        render();
    });

    backBtn?.addEventListener('click', () => {
        if (finished) {
            finished = false;
            const last = visibleQuestions(answers);
            stepIndex = Math.max(0, last.length - 1);
            render();
            return;
        }

        if (stepIndex === 0) {
            return;
        }

        stepIndex -= 1;
        render();
    });

    restartBtn?.addEventListener('click', () => {
        Object.keys(answers).forEach((key) => {
            delete answers[key];
        });
        skippedAddons.length = 0;
        stepIndex = 0;
        finished = false;
        render();
    });

    root.querySelector('[data-guide-cta]')?.addEventListener('click', () => {
        applyEstimateToContact(answersToQuote(answers, skippedAddons), answers);
    });

    render();
}
