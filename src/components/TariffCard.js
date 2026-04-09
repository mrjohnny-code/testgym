import React from "react";

const TariffCard = React.memo(({ tariff, selectedTariff, onSelect, showDiscount, animatedPrice }) => {
	const isSelected = selectedTariff?.uid === tariff.uid;

	return (
		<div
			onClick={() => onSelect(tariff)}
			className={`
				border cursor-pointer relative bg-[#313637] hover:border-[#FDB056] transition-colors
				col-span-3 rounded-[34px] flex items-center xl:justify-center gap-[30px] md:gap-[40px] p-[20px] md:py-[30px] md:px-[30px] xl:pl-[120px] pr-[11px] xl:pr-[80px]
				${!tariff.is_best ? "xl:col-span-1 xl:rounded-[40px] xl:flex-col justify-start xl:!px-[18px] xl:pt-[70px] xl:pb-[23px]" : ""}
				${selectedTariff?.uid === tariff.uid ? 'border-[#FDB056]' : 'border-[#484D4E]'}
			`}
		>	
			<div 
				className={`
					absolute top-0 right-[30px] xl:right-[auto] xl:left-[51px] z-1 bg-[#FD5656] font-medium text-white text-[clamp(16px,1.2vw,22px)] leading-[130%] px-[6px] md:px-2 py-[3px] md:py-[5px] rounded-b-lg
					${tariff.is_best ? 'right-[70px]' : ''}
				`}
			>
				-{tariff.discount}%
			</div>
			{tariff.is_best && <div className="text-[#FDB056] text-[clamp(13px,1.2vw,22px)] font-medium leading-[130%] absolute top-[10px] right-[20px] z-1">хит!</div>}
			<div className={`flex flex-col md:items-center shrink-0`}>
				<div className={`self-center text-[clamp(16px,1.4vw,26px)] leading-[120%] font-medium min-w-[120px]  ${tariff.is_best ? 'mb-2' : 'mb-[16px] lg:mb-[30px]'}`}>{tariff.period}</div>
				<div className={`text-[clamp(30px,2.8vw,50px)] leading-[100%] font-semibold ${tariff.is_best ? 'text-[#FDB056]' : ''}`}>
					{showDiscount
						? tariff.price
						: animatedPrice[tariff.uid] ?? tariff.full_price
					} ₽
				</div>
				{showDiscount && (
					<div className="self-end line-through text-[clamp(14px,1.3vw,24px)] leading-[120%] font-regular text-[#919191]">
						{tariff.full_price} ₽
					</div>
				)}
			</div>
			<p className="text-white text-[clamp(14px,0.9vw,16px)] leading-[130%] py-[10px]">{tariff.text}</p>
		</div>
	);
});

export default TariffCard;