import CountDownTimer from "@/components/CountDownTimer";
import TariffCard from "@/components/TariffCard";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Home() {
	const [tariffs, setTariffs] = useState([]);
	const [selectedTariff, setSelectedTariff] = useState(null);
	const [agreed, setAgreed] = useState(false);
	const [agreedError, setAgreedError] = useState(false);
	const [showDiscount, setShowDiscount] = useState(true);
	const [animatedPrice, setAnimatedPrice] = useState({});
	
	// тарифы, скидка, выбор лучшего тарифа
	useEffect(() => {
		const fetchTariffs = async () => {
			try {
				const res = await fetch('https://t-core.fit-hub.pro/Test/GetTariffs');
				const data = await res.json();

				const formatted = data.map((item, idx) => ({
					...item,
					discount: Math.round(((item.full_price - item.price) / item.full_price) * 100),
					uid: `${item.id}-${idx}`
				}));

				const sorted = formatted.sort((a,b) => {
					if(a.is_best) return -1;
					if(b.is_best) return 1;

					return a.discount - b.discount;
				})

				setTariffs(sorted);
				setSelectedTariff(sorted.find(t => t.is_best) || sorted[0] || null);
			} catch(err) {
				console.log(err);
				alert('Ошибка загрузки тарифов')
			}
		}
		fetchTariffs();
	}, []);
	
	// таймер
	const handleTimerExpire = useCallback(() => {
		setShowDiscount(false);
		tariffs.forEach(animPrice);
	}, [tariffs]);

	// анимация цены(конец скидки)
	const animPrice = useCallback((tariff) => {
		const start = tariff.price;
		const end = tariff.full_price;
		if(start == null || end == null) return;

		const steps = 30; 
		const increment = (end - start) / steps;
		let current = start;
		let stepCount = 0;

		const anim = setInterval(() => {
			current += increment;
			stepCount++;

			if(stepCount >= steps) {
				current = end;
				clearInterval(anim);
			}

			setAnimatedPrice(prev => ({
				...prev,
				[tariff.uid]: Math.round(current)
			}));
		}, 1200 / steps);
	}, []);

	// кнопка покупки
	const handleBuy = useCallback(() => {
		if (!agreed) {
			setAgreedError(true);
			return;
		}

		setAgreedError(false);
		alert(`Вы выбрали тариф: ${selectedTariff.period || 'не выбран'}`);
	}, [agreed, selectedTariff]);

	// чекбокс согласия
	useEffect(() => {
		if(agreed) setAgreedError(false);
	}, [agreed]);

	return (
		<div className="min-h-screen bg-[#232829] text-white flex flex-col items-center font-montserrat">
			{/* Таймер */}
			<CountDownTimer initialSeconds={120} onExpire={handleTimerExpire} />
			
			{/* Контент */}
			<div className="container py-[75px] md:py-[95px] px-4">
				{/* Заголовок */}
				<h1 className="text-[clamp(22px,2.1vw,40px)] font-bold mb-[24px] md:mb-[50px] lg:mb-[110px] pt-[20px] md:pt-[50px] leading-[110%] font-bold">
					Выбери подходящий для себя <span className="text-[#FDB056]">тариф</span>
				</h1>
				
				{/* Контейнер тарифов */}
				<div className="lg:grid lg:grid-cols-2 items-center gap-[87px]">
					<div className="flex justify-center items-center">
						<Image src={`${basePath}/images/img.webp`} className="max-w-[100px] md:max-w-[200px] lg:max-w-[100%]" alt="image" width={380} height={767} />
					</div>
					
					<div className="flex flex-col">
						{/* Карточки тарифов */}
						<div className="grid grid-cols-3 gap-[6px] md:gap-[14px] mb-[10px] md:mb-5">
							{tariffs.map(tariff => (
								<TariffCard 
									key={tariff.uid}
									tariff={tariff}
									selectedTariff={selectedTariff}
									onSelect={setSelectedTariff}
									showDiscount={showDiscount}
									animatedPrice={animatedPrice}
								/>
							))}
						</div>

						<div className="flex gap-2 px-[14px] md:px-[20px] py-[14px] md:py-[18px] mb-4 md:mb-[30px] bg-[#2D3233] rounded-[20px] max-w-[499px]">
							<svg className="shrink-0 mt-[2px]" width="24" height="26" viewBox="0 0 3 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.377523 11.6437C0.386898 12.2578 0.888461 12.75 1.50252 12.75C2.11659 12.75 2.61815 12.2531 2.62752 11.6437L3.00252 1.5375C3.02596 1.15313 2.88534 0.778125 2.61346 0.4875C2.32284 0.178125 1.91971 0 1.50252 0C1.08534 0 0.682211 0.178125 0.391586 0.4875C0.119711 0.778125 -0.0209143 1.15313 0.00252325 1.5375L0.377523 11.6437Z" fill="#FDB056"/><path d="M1.5 18C2.32843 18 3 17.3284 3 16.5C3 15.6716 2.32843 15 1.5 15C0.671573 15 0 15.6716 0 16.5C0 17.3284 0.671573 18 1.5 18Z" fill="#FDB056"/></svg>
							<p className="text-[clamp(12px,0.9vw,16px)] leading-[130%] text-white">Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат, чем за 1 месяц</p>
						</div>
						

						{/* Чекбокс + Кнопка + Текст */}
						<div className="flex flex-col items-start">
							<label className="flex items-center gap-2 mb-4 cursor-pointer group">
								<input
									type="checkbox"
									className="hidden peer"
									checked={agreed}
									onChange={() => setAgreed((prev) => !prev)}
								/>
								<div 
									className={`
										flex items-center justify-center shrink-0 w-[32px] h-[32px] p-[5px] rounded-[4px] border-1 border-[#606566] group-hover:border-[#FDB056] transition-colors
										${agreedError ? 'border-[#FF4E4E] animate-pulse' : ''}
									`}
								>
									{agreed &&
										<svg width="20" height="14" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.4727 0.570312C19.5464 0.491786 19.6674 0.477847 19.7568 0.533203L19.793 0.561523C19.8834 0.647109 19.8879 0.791255 19.8018 0.882812L7.43848 13.9736C7.39461 14.02 7.33545 14.0458 7.27344 14.0459H7.27148C7.22257 14.0452 7.1766 14.0286 7.13867 14.001L7.10352 13.9697L0.558594 6.69727C0.474798 6.60415 0.482343 6.46058 0.575195 6.37695C0.667705 6.29371 0.811212 6.29874 0.898438 6.39453L6.91406 13.0791L7.27734 13.4824L7.64941 13.0879L19.4717 0.571289L19.4727 0.570312Z" fill="#424748" stroke="#FDB056"/></svg>
									}
								</div>
								<span className="text-[#CDCDCD] text-[clamp(12px,0.9vw,16px)]">Я согласен с <a href="#" className="underline hover:no-underline">офертой рекуррентных платежей</a> и <a href="#" className="underline hover:no-underline">Политикой конфиденциальности</a></span>
							</label>
							<button
								onClick={handleBuy}
								className={`
									bg-[#FDB056] w-full md:w-[352px] self-start rounded-[20px] mb-[10px] md:mb-[16px] py-[20px] text-[#191E1F] text-[clamp(18px,1.05vw,20px)] leading-[130%] font-bold transition-all cursor-pointer
									${!agreed ? "animate-pulse" : "hover:brightness-110"}
								`}
							>
								Купить
							</button>
							<p className="text-[#9B9B9B] text-[clamp(10px,0.8vw,14px)] leading-[120%]">Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для получения пожизненного доступа к приложению. Пользователь соглашается, что данные кредитной/дебетовой карты будут сохранены для осуществления покупок дополнительных услуг сервиса в случае желания пользователя.</p>
						</div>
					</div> {/* /.flex-col враппер */}
				</div> {/* /.grid-cols-2 контейнер тарифов */}
				{/* Гарантия */}
				<div className="mt-[22px] md:mt-[66px] p-[12px] md:p-5 border border-[#484D4E] rounded-[30px]">
					<div className="border border-[#81FE95] rounded-[30px] w-fit mb-[10px] md:mb-[30px] px-[18px] md:px-[30px] py-[10px] md:py-[16px] bg-[#2D3233] text-[clamp(16px,1.5vw,28px)] leading-[120%] text-medium text-[#81FE95]">гарантия возврата 30 дней</div>
					<p className="text-[clamp(13px,1.3vw,24px)] leading-[130%] text-[#DCDCDC]">Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь видимых результатов.</p>
				</div>
			</div> {/* /.container контент */}

		</div>
	);
}