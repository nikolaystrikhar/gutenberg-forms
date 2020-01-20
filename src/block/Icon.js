import React, { useState } from "react";

function Icon(props) {
	const [icons, setIcons] = useState({
		main: () => (
			<svg
				width="25"
				height="11"
				viewBox="0 0 25 11"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.44171 9.04291C9.20156 8.44558 8.85305 7.90301 8.4156 7.44542C7.97948 6.9865 7.46286 6.62061 6.89425 6.36795C6.88916 6.36527 6.88407 6.36394 6.87898 6.36126C7.67211 5.7597 8.18772 4.77981 8.18772 3.67427C8.18772 1.84284 6.77458 0.358978 5.03045 0.358978C3.28631 0.358978 1.87318 1.84284 1.87318 3.67427C1.87318 4.77981 2.38878 5.7597 3.18192 6.3626C3.17683 6.36527 3.17173 6.36661 3.16664 6.36928C2.5963 6.62194 2.08451 6.98422 1.6453 7.44675C1.20826 7.9047 0.859805 8.44718 0.619185 9.04424C0.3828 9.62877 0.255313 10.2555 0.243623 10.8904C0.243283 10.9046 0.245667 10.9188 0.250633 10.9321C0.255599 10.9454 0.263047 10.9575 0.272538 10.9677C0.28203 10.978 0.293372 10.9861 0.305898 10.9916C0.318424 10.9972 0.331879 11 0.34547 11H1.10933C1.16534 11 1.2099 10.9532 1.21117 10.8957C1.23663 9.86371 1.63129 8.8972 2.32895 8.16462C3.05079 7.40665 4.00943 6.98956 5.03045 6.98956C6.05147 6.98956 7.01011 7.40665 7.73195 8.16462C8.4296 8.8972 8.82426 9.86371 8.84972 10.8957C8.851 10.9545 8.89555 11 8.95157 11H9.71543C9.72902 11 9.74247 10.9972 9.755 10.9916C9.76752 10.9861 9.77887 10.978 9.78836 10.9677C9.79785 10.9575 9.8053 10.9454 9.81026 10.9321C9.81523 10.9188 9.81761 10.9046 9.81727 10.8904C9.80454 10.2514 9.67851 9.62977 9.44171 9.04291V9.04291ZM5.03045 5.97359C4.4461 5.97359 3.89612 5.7343 3.48237 5.29983C3.06861 4.86537 2.84073 4.28787 2.84073 3.67427C2.84073 3.06067 3.06861 2.48317 3.48237 2.04871C3.89612 1.61424 4.4461 1.37496 5.03045 1.37496C5.6148 1.37496 6.16477 1.61424 6.57853 2.04871C6.99228 2.48317 7.22017 3.06067 7.22017 3.67427C7.22017 4.28787 6.99228 4.86537 6.57853 5.29983C6.16477 5.7343 5.6148 5.97359 5.03045 5.97359Z"
					fill="#5d13e7"
				/>
				<g filter="url(#filter0_d)">
					<line
						x1="10.5982"
						y1="0.876099"
						x2="20.2436"
						y2="0.876099"
						stroke="#5d13e7"
					/>
				</g>
				<line
					x1="10.5982"
					y1="5.78732"
					x2="20.2436"
					y2="5.78732"
					stroke="#5d13e7"
				/>
				<line
					x1="10.5982"
					y1="10.3916"
					x2="20.2436"
					y2="10.3916"
					stroke="#5d13e7"
				/>
				<defs>
					<filter
						id="filter0_d"
						x="6.59816"
						y="0.376099"
						width="17.6454"
						height="9"
						filterUnits="userSpaceOnUse"
						color-interpolation-filters="sRGB"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset dy="4" />
						<feGaussianBlur stdDeviation="2" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
						/>
						<feBlend
							mode="normal"
							in2="BackgroundImageFix"
							result="effect1_dropShadow"
						/>
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="effect1_dropShadow"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		),
		twoColumn: () => (
			<svg
				height="26"
				viewBox="0 0 50 26"
				width="50"
				xmlns="http://www.w3.org/2000/svg"
				class="dashicon"
				role="img"
				aria-hidden="true"
				focusable="false"
			>
				<g fill-rule="evenodd">
					<path
						d="m48.0833333 0h-46.16666663c-1.05416667 0-1.91666667.9-1.91666667 2v22c0 1.1.8625 2 1.91666667 2h46.16666663c1.0541667 0 1.9166667-.9 1.9166667-2v-22c0-1.1-.8625-2-1.9166667-2zm0 24h-46.16666663v-22h46.16666663z"
						fill-rule="nonzero"
					></path>
					<path d="m24 2h2v22h-2z"></path>
				</g>
			</svg>
		),
		threeColumn: () => (
			<svg
				height="26"
				viewBox="0 0 50 26"
				width="50"
				xmlns="http://www.w3.org/2000/svg"
				class="dashicon"
				role="img"
				aria-hidden="true"
				focusable="false"
			>
				<g fill-rule="evenodd">
					<path
						d="m48.0833333 0h-46.16666663c-1.05416667 0-1.91666667.9-1.91666667 2v22c0 1.1.8625 2 1.91666667 2h46.16666663c1.0541667 0 1.9166667-.9 1.9166667-2v-22c0-1.1-.8625-2-1.9166667-2zm0 24h-46.16666663v-22h46.16666663z"
						fill-rule="nonzero"
					></path>
					<path d="m16 2h2v22h-2z"></path>
					<path d="m32 2h2v22h-2z"></path>
				</g>
			</svg>
		),
		fourColumn: () => (
			<svg
				height="26"
				viewBox="0 0 50 26"
				width="50"
				xmlns="http://www.w3.org/2000/svg"
				class="dashicon"
				role="img"
				aria-hidden="true"
				focusable="false"
			>
				<g fill-rule="evenodd">
					<path
						d="m48.0833333 0h-46.16666663c-1.05416667 0-1.91666667.9-1.91666667 2v22c0 1.1.8625 2 1.91666667 2h46.16666663c1.0541667 0 1.9166667-.9 1.9166667-2v-22c0-1.1-.8625-2-1.9166667-2zm0 24h-46.16666663v-22h46.16666663z"
						fill-rule="nonzero"
					></path>
					<path d="m12 2h2v22h-2z"></path>
					<path d="m24 2h2v22h-2z"></path>
					<path d="m36 2h2v22h-2z"></path>
				</g>
			</svg>
		)
	});

	let RequiredIcon = icons[props.icon];

	return <RequiredIcon />;
}

export default Icon;
