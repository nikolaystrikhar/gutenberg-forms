<div class="wrap">

	<h1>Gutenberg Forms</h1>

	<h3>Details for form with ID <?php echo $form_id; ?></h3>

	<table class="widefat fixed striped">

		<thead>
			<tr>
				<th>ID</th>
				<th>Submitted on</th>
				<?php foreach( $columns as $column_name ): ?>
					<th><?php echo $column_name; ?></th>
				<?php endforeach; ?>
			</tr>
		</thead>

		<tbody>
			<?php foreach( $submissions as $submission ): ?>
				<tr>
					<td><?php echo $submission[ 'id' ]; ?></td>
					<td><?php echo $submission[ 'post_date' ]; ?></td>
					<?php foreach( $submission[ 'fields' ] as $value ): ?>
						<td><?php echo $value; ?></td>
					<?php endforeach; ?>
				</tr>
			<?php endforeach; ?>
		</tbody>

	</table>

</div>
