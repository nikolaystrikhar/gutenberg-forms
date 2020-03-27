<div class="wrap">

	<h1>Gutenberg Forms</h1>
	<br>

	<?php if ( count( $forms ) === 0 ): ?>

		<h3>No submissions yet.</h3>

	<?php else: ?>

		<table class="fixed widefat striped">
			<thead>
			<tr>
				<th>Post ID</th>
				<th>Form Title</th>
				<th>Number of Submissions</th>
				<th>Actions</th>
			</tr>
			</thead>
			<?php foreach ( $forms as $form_id => $form ): ?>
				<tr>
					<td><?php echo $form_id ?></td>
					<td><?php echo $form[ 'title' ]; ?></td>
					<td><?php echo $form[ 'submissions' ] ?></td>
					<td>
						<a class="button" href="<?php echo $form[ 'edit_form_url' ]; ?>">Edit form</a>
						<a class="button" href="<?php echo $form[ 'view_form_url' ]; ?>">View form</a><br><br>
						<a class="button" href="<?php echo $form[ 'view_details_url' ]; ?>">View details</a>
					</td>
				</tr>
			<?php endforeach; ?>
		</table>

	<?php endif; ?>

</div>
