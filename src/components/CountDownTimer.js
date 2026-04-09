import { useState, useEffect, useRef, useCallback } from 'react';

export default function CountDownTimer({ initialSeconds = 120, onExpire }) {
	const [timeLeft, setTimeLeft] = useState(initialSeconds);
	const timerRef = useRef(null);

	useEffect(() => {
		timerRef.current = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timerRef.current);
					onExpire?.();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timerRef.current);
	}, [onExpire]);

	const formatTime = useCallback((sec) => {
		const m = Math.floor(sec / 60).toString().padStart(2, "0");
		const s = (sec % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	}, []);

	return (
		<div className={`fixed top-0 left-0 z-99 w-full flex flex-col items-center text-white p-2 bg-[#1D5B43]`}>
			<span className="text-[clamp(14px,1.3vw,24px)] leading-[130%] mb-1 font-semibold">Успейте открыть пробную неделю</span>
			<span 
				className={`
					flex items-center gap-2 text-[clamp(28px,2.1vw,40px)] leading-[110%] font-raleway font-bold
					${timeLeft <= 0 ? 'text-white' : ''}
					${timeLeft > 0 && timeLeft <=30 ? 'text-[#FF4E4E] animate-pulse' : ''}
					${timeLeft > 30 ? 'text-[#FFBB00]' : ''}
				`}
				>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z" fill="currentColor"/></svg>
				{formatTime(timeLeft)}
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z" fill="currentColor"/></svg>
			</span>
		</div>
	);
}