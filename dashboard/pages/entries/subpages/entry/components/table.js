import React from 'react';
import { map, isEmpty, includes } from 'lodash';
import { linkify } from '../../../utils';

function Table(props) {
	const { data, preCells = [] } = props;

	return (
		!isEmpty(data) && (
			<table className="cwp-entry-detail-table">
				<tbody>
					{map(data, (value, key) => {
						const isPreCell = includes(preCells, key);
						const cell_value = isPreCell
							? `<pre>${value}</pre>`
							: value;

						return (
							<tr key={key}>
								<td style={{ borderRight: '1px solid #ccc' }}>
									<strong>{key}</strong>{' '}
								</td>
								<td
									dangerouslySetInnerHTML={{
										__html: !isEmpty(cell_value)
											? linkify(cell_value)
											: '-',
									}}
								></td>
							</tr>
						);
					})}
				</tbody>
			</table>
		)
	);
}

export default Table;
