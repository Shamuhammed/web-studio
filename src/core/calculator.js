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
            extraGain: 'Больше точек входа',
        },
        includedAddons: [],
        gain: 'Заявки с рекламы',
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
            extraGain: 'Больше точек входа',
        },
        includedAddons: ['i18n', 'crm', 'belgie'],
        gain: 'Клиенты из поиска',
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
            extraGain: 'Больше точек входа',
        },
        includedAddons: ['crm', 'payments', 'belgie'],
        gain: 'Продажи без менеджера',
    },
};

const ADDONS = {
    design: { label: 'Дизайн-концепт с нуля', price: 500, days: 3, gain: 'Выше чек' },
    i18n: { label: 'Мультиязычность', price: 350, days: 3, gain: 'Второй рынок' },
    crm: { label: 'Интеграция с CRM', price: 400, days: 2, gain: 'Заявки не теряются' },
    payments: { label: 'Платежи ЕРИП / bePaid / WebPay', price: 250, days: 2, gain: 'Оплата на сайте' },
    belgie: { label: 'Регистрация в БелГИЭ и локальный хостинг', price: 150, days: 1, gain: 'Можно рекламировать' },
};

const RETAINERS = {
    support: { label: 'Техническая поддержка', price: 250, adsBudget: false, gain: 'Сайт не падает' },
    ads: { label: 'Контекстная реклама', price: 450, adsBudget: true, gain: 'Лиды по кнопке' },
    seo: { label: 'SEO + контент', price: 750, adsBudget: false, gain: 'Заявки без клика' },
    complex: { label: 'Комплексный маркетинг', price: 1200, adsBudget: true, gain: 'Один контур заявок' },
};

const STANDALONE_RETAINERS = ['support', 'ads', 'seo'];

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
    return [...root.querySelectorAll('[name="calc-addon"]:checked')]
        .map((input) => input.value)
        .filter((id) => id in ADDONS && !pkg.includedAddons.includes(id));
}

function getSelectedRetainerIds(root) {
    return [...root.querySelectorAll('[name="calc-retainer"]:checked')]
        .map((input) => input.value)
        .filter((id) => id in RETAINERS);
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
    const retainerIds = getSelectedRetainerIds(root);
    const extraVolumePrice = extraVolume * pkg.volume.extraPrice;
    const addonsPrice = addonIds.reduce((sum, id) => sum + ADDONS[id].price, 0);
    const monthly = retainerIds.reduce((sum, id) => sum + RETAINERS[id].price, 0);
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
        retainerIds,
        adsBudget: retainerIds.some((id) => RETAINERS[id].adsBudget),
        oneTime,
        monthly,
        days,
    };
}

function buildGains(result) {
    const gains = [result.pkg.gain];

    if (result.extraVolume > 0 && result.pkg.volume.extraGain) {
        gains.push(result.pkg.volume.extraGain);
    }

    result.addonIds.forEach((id) => {
        if (ADDONS[id].gain) {
            gains.push(ADDONS[id].gain);
        }
    });

    result.retainerIds.forEach((id) => {
        if (RETAINERS[id].gain) {
            gains.push(RETAINERS[id].gain);
        }
    });

    return [...new Set(gains.filter(Boolean))];
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

    result.retainerIds.forEach((id) => {
        lines.push({
            label: `${RETAINERS[id].label} / мес.`,
            value: formatByn(RETAINERS[id].price),
        });
    });

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

    if (result.retainerIds.length > 0) {
        lines.push(`Сопровождение: ${result.retainerIds.map((id) => RETAINERS[id].label).join(', ')}`);
    }

    if (result.adsBudget) {
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

function renderAddons(root, packageId, pkg) {
    const previousId = root.dataset.calcPackage;
    const hint = root.querySelector('[data-calc-addons-hint]');

    Object.keys(ADDONS).forEach((id) => {
        const input = root.querySelector(`[name="calc-addon"][value="${id}"]`);
        const badge = root.querySelector(`[data-calc-addon-badge="${id}"]`);
        const included = pkg.includedAddons.includes(id);

        if (!input) {
            return;
        }

        if (included) {
            input.checked = true;
            input.disabled = true;
        } else {
            input.disabled = false;
            if (previousId && PACKAGES[previousId]?.includedAddons.includes(id)) {
                input.checked = false;
            }
        }

        if (badge) {
            badge.classList.toggle('hidden', !included);
        }
    });

    root.dataset.calcPackage = packageId;

    if (hint) {
        hint.textContent = pkg.includedAddons.length
            ? `Можно выбрать несколько. Уже в тарифе: ${pkg.includedAddons.map((id) => ADDONS[id].label).join(', ')}.`
            : 'Можно выбрать несколько опций.';
    }

    renderAddonLabel(root);
}

function renderAddonLabel(root) {
    const label = root.querySelector('[data-calc-addons-label]');

    if (!label) {
        return;
    }

    const pkg = PACKAGES[getSelectedPackage(root)];
    const ids = getSelectedAddons(root, pkg);

    label.textContent = ids.length > 0
        ? ids.map((id) => ADDONS[id].label).join(', ')
        : 'Без дополнительных опций';
}

function renderSummary(root, result) {
    const oneTime = root.querySelector('[data-calc-one-time]');
    const monthly = root.querySelector('[data-calc-monthly]');
    const days = root.querySelector('[data-calc-days]');
    const adsNote = root.querySelector('[data-calc-ads-note]');
    const gains = root.querySelector('[data-calc-gains]');
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
        adsNote.classList.toggle('hidden', !result.adsBudget);
    }

    if (gains) {
        gains.replaceChildren(
            ...buildGains(result).map((text) => {
                const item = document.createElement('li');
                item.className = 'rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800';
                item.textContent = text;
                return item;
            }),
        );
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

function syncRetainerExclusivity(root, changed) {
    if (!changed.checked) {
        return;
    }

    if (changed.value === 'complex') {
        STANDALONE_RETAINERS.forEach((id) => {
            const input = root.querySelector(`[name="calc-retainer"][value="${id}"]`);
            if (input) {
                input.checked = false;
            }
        });
        return;
    }

    const complex = root.querySelector('[name="calc-retainer"][value="complex"]');
    if (complex) {
        complex.checked = false;
    }
}

function renderRetainerLabel(root) {
    const label = root.querySelector('[data-calc-retainers-label]');

    if (!label) {
        return;
    }

    const ids = getSelectedRetainerIds(root);

    if (ids.length === 0) {
        label.textContent = 'Без сопровождения';
        return;
    }

    label.textContent = ids.map((id) => RETAINERS[id].label).join(', ');
}

function initCalcDropdown(root, name) {
    const wrap = root.querySelector(`[data-calc-${name}]`);
    const toggle = root.querySelector(`[data-calc-${name}-toggle]`);
    const panel = root.querySelector(`[data-calc-${name}-panel]`);

    if (!wrap || !toggle || !panel) {
        return;
    }

    const setOpen = (open) => {
        panel.classList.toggle('hidden', !open);
        toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => {
        setOpen(panel.classList.contains('hidden'));
    });

    document.addEventListener('click', (event) => {
        if (!wrap.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    });
}

function update(root) {
    const packageId = getSelectedPackage(root);
    const pkg = PACKAGES[packageId];
    renderVolume(root, pkg);
    renderAddons(root, packageId, pkg);
    renderRetainerLabel(root);
    renderSummary(root, calculate(root));
}

export function initCalculator() {
    const root = document.querySelector('#calculator');

    if (!root) {
        return;
    }

    initCalcDropdown(root, 'addons');
    initCalcDropdown(root, 'retainers');

    root.addEventListener('change', (event) => {
        if (event.target.matches('[name="calc-retainer"]')) {
            syncRetainerExclusivity(root, event.target);
        }

        update(root);
    });
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
