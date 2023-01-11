import React from 'react';

const Action = ({ data }) => (
	<div className="gufo-relative gufo-group gufo-bg-white gufo-p-6 focus-within:gufo-ring-2 focus-within:gufo-ring-inset focus-within:gufo-ring-indigo-500">
		<div>
			<span
				className={`${data.color} gufo-rounded-lg gufo-inline-flex gufo-p-3 gufo-ring-4 gufo-ring-white`}
				dangerouslySetInnerHTML={{ __html: data.icon }}
			/>
		</div>

		<div className="gufo-mt-8">
			<h3 className="gufo-text-lg gufo-font-medium">
				<a href={data.link} target={data.external ? "_blank" : "_self"} className="gufo-focus:outline-none">
					<span className="gufo-absolute gufo-inset-0" aria-hidden="true"></span>
					{data.title}
				</a>
			</h3>

			<p className="gufo-mt-2 gufo-text-sm gufo-text-gray-500">
				{data.description}
			</p>
		</div>

		<span
			className="gufo-pointer-events-none gufo-absolute gufo-top-6 gufo-right-6 gufo-text-gray-300 group-hover:gufo-text-gray-400"
			aria-hidden="true">
				{data.external ? (
					<svg className="gufo-h-4 gufo-w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
						<path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"/>
					</svg>
				) : (
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="gufo-w-6 gufo-h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
					</svg>
				)}
			</span>
	</div>
);

export default Action;
