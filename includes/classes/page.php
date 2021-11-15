<?php

/**
 * page.php
 */

namespace wishthis;

class Page
{
    private string $language = 'en';

    /**
     * __construct
     *
     * @param string $filepath The filepath (__FILE__) of the page.
     * @param string $title    The HTML title of the page.
     */
    public function __construct(string $filepath, public string $title = 'wishthis')
    {
        $this->name = pathinfo($filepath, PATHINFO_FILENAME);
    }

    public function header(): void
    {
        ?>
        <!DOCTYPE html>
        <html lang="<?= $this->language ?>">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <?php
            /**
             * Stylesheets
             */

            /** Default */
            $stylesheetDefault = 'includes/assets/css/default.css';
            $stylesheetDefaultModified = filemtime($stylesheetDefault);
            echo '<link rel="stylesheet" href="' . $stylesheetDefault . '?m=' . $stylesheetDefaultModified . '" />';

            /** Page */
            $stylesheetPage = 'includes/assets/css/' . $this->name .  '.css';

            if (file_exists($stylesheetPage)) {
                $stylesheetPageModified = filemtime($stylesheetPage);

                echo '<link rel="stylesheet" href="' . $stylesheetPage . '?m=' . $stylesheetPageModified . '" />';
            }
            ?>

            <title><?= $this->title ?></title>
        </head>
        <body>
        <?php
    }

    public function footer(): void
    {
        ?>
        </body>
        </html>
        <?php
    }
}