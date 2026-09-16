const PACKAGES = {
    landing: {
        label: 'Express Landing',
        price: 850,
        days: [7, 10],
        volume: {
            key: 'screens',
            label: 'Количество экранов',
            min: 6,
            max: 16,
            included: 8,
            step: 1,
            unit: 'экр.',
            extraPrice: 80,
            extraDays: 1,
        },
        includedAddons: [],
    },
    business: {
        label: 'Бизнес-Сайт SEO Ready',
        price: 1650,
        days: [15, 22],
        volume: {
            key: 'pages',
            label: 'Количество страниц',
            min: 8,
            max: 40,
            included: 15,
            step: 1,
            unit: 'стр.',
            extraPrice: 90,
            extraDays: 1,
        },
        includedAddons: ['i18n', 'crm', 'belgie'],
    },
    ecommerce: {
        label: 'Каталог / E-Commerce Start',
        price: 2650,
        days: [25, 35],
        volume: {
            key: 'products',
            label: 'Количество товаров',
            min: 50,
            max: 400,
            included: 100,
            step: 10,
            unit: 'тов.',
            extraPrice: 12,
            extraDaysPer: 50,
        },
        includedAddons: ['crm', 'payments', 'belgie'],
    },
};

const ADDONS = {
    design: { label: 'Дизайн-концепт с нуля', price: 500, days: 3 },
    i18n: { label: 'Мультиязычность', price: 350, days: 3 },
    crm: { label: 'Интеграция с CRM', price: 400, days: 2 },
    payments: { label: 'Платежи ЕРИП / bePaid / WebPay', price: 250, days: 2 },
    belgie: { label: 'Регистрация в БелГИЭ и локальный хостинг', price: 150, days: 1 },
};

const RETAINERS = {
    none: { label: 'Без ежемесячного сопровождения', price: 0, adsBudget: false },
    support: { label: 'Техническая поддержка', price: 250, adsBudget: false },
    ads: { label: 'Контекстная реклама', price: 450, adsBudget: true },
    seo: { label: 'SEO + контент', price: 750, adsBudget: false },
    complex: { label: 'Комплексный маркетинг', price: 1200, adsBudget: true },
};

function formatByn(value) {
    return `${new Intl.NumberFormat('ru-RU').format(value)} BYN`;
}

function getSelectedPackage(root) {
    const selected = root.querySelector('[name="calc-package"]');
    return selected?.value in PACKAGES ? selected.value : 'landing';
}

function getVolumeValue(root, pkg) {
    const input = root.querySelector('[data-calc-volume]');
    const raw = Number(input?.value);
    if (!Number.isFinite(raw)) {
        return pkg.volume.included;
    }

    return Math.min(pkg.volume.max, Math.max(pkg.volume.min, raw));
}

function getExtraVolume(pkg, volume) {
    return Math.max(0, volume - pkg.volume.included);
}

function getSelectedAddons(root, pkg) {
    const selected = root.querySelector('[name="calc-addons"]')?.value;

    if (!selected || !(selected in ADDONS) || pkg.includedAddons.includes(selected)) {
        return [];
    }

    return [selected];
}

function getSelectedRetainer(root) {
    const selected = root.querySelector('[name="calc-retainer"]');
    return selected?.value in RETAINERS ? selected.value : 'none';
}

function calcDays(pkg, extraVolume, addonIds) {
    let extraDays = 0;

    if (pkg.volume.extraDaysPer) {
        extraDays += Math.ceil(extraVolume / pkg.volume.extraDaysPer);
    } else {
        extraDays += extraVolume * (pkg.volume.extraDays || 0);
    }

    extraDays += addonIds.reduce((sum, id) => sum + ADDONS[id].days, 0);

    return [pkg.days[0], pkg.days[1] + extraDays];
}

function calculate(root) {
    const packageId = getSelectedPackage(root);
    const pkg = PACKAGES[packageId];
    const volume = getVolumeValue(root, pkg);
    const extraVolume = getExtraVolume(pkg, volume);
    const addonIds = getSelectedAddons(root, pkg);
    const retainerId = getSelectedRetainer(root);
    const retainer = RETAINERS[retainerId];
    const extraVolumePrice = extraVolume * pkg.volume.extraPrice;
    const addonsPrice = addonIds.reduce((sum, id) => sum + ADDONS[id].price, 0);
    const oneTime = pkg.price + extraVolumePrice + addonsPrice;
    const days = calcDays(pkg, extraVolume, addonIds);

    return {
        packageId,
        pkg,
        volume,
        extraVolume,
        extraVolumePrice,
        addonIds,
        addonsPrice,
        retainerId,
        retainer,
        oneTime,
        monthly: retainer.price,
        days,
    };
}

function buildBreakdown(result) {
    const lines = [
        { label: result.pkg.label, value: formatByn(result.pkg.price) },
    ];

    if (result.extraVolume > 0) {
        lines.push({
            label: `+ ${result.extraVolume} ${result.pkg.volume.unit} сверх тарифа`,
            value: formatByn(result.extraVolumePrice),
        });
    }

    result.addonIds.forEach((id) => {
        lines.push({
            label: ADDONS[id].label,
            value: formatByn(ADDONS[id].price),
        });
    });

    result.pkg.includedAddons.forEach((id) => {
        lines.push({
            label: `${ADDONS[id].label} (в тарифе)`,
            value: '0 BYN',
        });
    });

    if (result.monthly > 0) {
        lines.push({
            label: `${result.retainer.label} / мес.`,
            value: formatByn(result.monthly),
        });
    }

    return lines;
}

function buildEstimateText(result) {
    const lines = [
        `Тип сайта: ${result.pkg.label}`,
        `${result.pkg.volume.label}: ${result.volume}`,
        `Разово: ${formatByn(result.oneTime)}`,
        `Ежемесячно: ${result.monthly > 0 ? formatByn(result.monthly) : 'нет'}`,
        `Срок: ${result.days[0]}–${result.days[1]} дней`,
    ];

    if (result.addonIds.length > 0) {
        lines.push(`Допы: ${result.addonIds.map((id) => ADDONS[id].label).join(', ')}`);
    }

    if (result.retainerId !== 'none') {
        lines.push(`Сопровождение: ${result.retainer.label}`);
    }

    if (result.retainer.adsBudget) {
        lines.push('Рекламный бюджет не входит в сумму.');
    }

    lines.push('Ориентировочный расчёт с калькулятора на сайте.');

    return lines.join('\n');
}

function renderVolume(root, pkg) {
    const wrap = root.querySelector('[data-calc-volume-wrap]');
    const input = root.querySelector('[data-calc-volume]');
    const label = root.querySelector('[data-calc-volume-label]');
    const valueLabel = root.querySelector('[data-calc-volume-value]');
    const hint = root.querySelector('[data-calc-volume-hint]');

    if (!wrap || !input) {
        return;
    }

    input.min = String(pkg.volume.min);
    input.max = String(pkg.volume.max);
    input.step = String(pkg.volume.step);

    const current = Number(input.value);
    if (!Number.isFinite(current) || current < pkg.volume.min || current > pkg.volume.max) {
        input.value = String(pkg.volume.included);
    }

    if (label) {
        label.textContent = pkg.volume.label;
    }

    if (valueLabel) {
        valueLabel.textContent = `${input.value} ${pkg.volume.unit}`;
    }

    if (hint) {
        hint.textContent = `В тарифе: ${pkg.volume.included} ${pkg.volume.unit}. Сверх тарифа — ${formatByn(pkg.volume.extraPrice)} за единицу.`;
    }
}

function renderAddons(root, pkg) {
    const select = root.querySelector('[name="calc-addons"]');
    const hint = root.querySelector('[data-calc-addons-hint]');

    if (!select) {
        return;
    }

    Object.keys(ADDONS).forEach((id) => {
        const option = select.querySelector(`option[value="${id}"]`);

        if (!option) {
            return;
        }

        const included = pkg.includedAddons.includes(id);
        option.hidden = included;
        option.disabled = included;
    });

    if (pkg.includedAddons.includes(select.value)) {
        select.value = '';
    }

    if (hint) {
        hint.textContent = pkg.includedAddons.length
            ? `Уже в тарифе: ${pkg.includedAddons.map((id) => ADDONS[id].label).join(', ')}.`
            : '';
    }
}

function renderSummary(root, result) {
    const oneTime = root.querySelector('[data-calc-one-time]');
    const monthly = root.querySelector('[data-calc-monthly]');
    const days = root.querySelector('[data-calc-days]');
    const adsNote = root.querySelector('[data-calc-ads-note]');
    const list = root.querySelector('[data-calc-breakdown]');

    if (oneTime) {
        oneTime.textContent = formatByn(result.oneTime);
    }

    if (monthly) {
        monthly.textContent = result.monthly > 0 ? `${formatByn(result.monthly)}/мес.` : '0 BYN';
    }

    if (days) {
        days.textContent = `${result.days[0]}–${result.days[1]} дней`;
    }

    if (adsNote) {
        adsNote.classList.toggle('hidden', !result.retainer.adsBudget);
    }

    if (list) {
        list.replaceChildren(
            ...buildBreakdown(result).map((line) => {
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
}

function applyEstimateToContact(result) {
    const typeField = document.querySelector('#site-type');
    const messageField = document.querySelector('#message');

    if (typeField) {
        typeField.value = result.packageId;
    }

    if (messageField) {
        messageField.value = buildEstimateText(result);
    }
}

function update(root) {
    const packageId = getSelectedPackage(root);
    const pkg = PACKAGES[packageId];
    renderVolume(root, pkg);
    renderAddons(root, pkg);
    renderSummary(root, calculate(root));
}

export function initCalculator() {
    const root = document.querySelector('#calculator');

    if (!root) {
        return;
    }

    root.addEventListener('change', () => update(root));
    root.addEventListener('input', (event) => {
        if (event.target.matches('[data-calc-volume]')) {
            update(root);
        }
    });

    root.querySelector('[data-calc-cta]')?.addEventListener('click', () => {
        applyEstimateToContact(calculate(root));
    });

    update(root);
}
