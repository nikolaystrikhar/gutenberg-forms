<?php


/**
 * ? This class will handle all the ajax requests supported for entries
 */

class cwp_gf_entriesAjaxRequestsHandler
{

    const post_type = "cwp_gf_entries";

    /**
     *  all ajax actions will be registered 
     */

    public function register()
    {
        add_action('wp_ajax_cwp_gf_update_entry_status', function () {
            return $this->update_status($_POST['status'], $_POST['id']);
        });

        add_action('wp_ajax_cwp_gf_delete_entry', function () {
            return $this->delete($_POST['id']);
        });
    }

    /**
     * Will find and delete the entry matching the given id
     * @param ID id of the entry 
     */

    public function delete($id)
    {
        try {
            wp_delete_post($id);
            echo json_encode([
                'message' => 'Entry deleted Successfully'
            ]);
        } catch (\Exception $e) {
            return json_encode([
                'error'    => $e->getMessage()
            ]);
        }
    }

    /**
     * Will update entry status 
     * @param string $status - Status To Update (possible status = 'read', 'unread')
     * @param string $id - The post type id of the entry which status will be updated 
     */

    public function update_status($status, $id)
    {

        try {

            $meta_key = "status__" . self::post_type;
            update_post_meta($id, $meta_key, $status);

            echo json_encode([
                'message' => 'Status Updated Successfully!'
            ]);
        } catch (\Exception $e) {
            return json_encode([

                'error' => $e->getMessage()

            ]);
        }
    }
}

# initialization

$cwp_gf_entries_ajax_handler = new cwp_gf_entriesAjaxRequestsHandler();
$cwp_gf_entries_ajax_handler->register();
