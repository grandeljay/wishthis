<?php

/**
 * A wish
 *
 * @author Jay Trees <github.jay@grandel.anonaddy.me>
 */

namespace wishthis;

class Wish
{
    private EmbedCache $cache;

    public int $id;
    public int $wishlist;
    public ?string $title;
    public ?string $description;
    public ?string $image;
    public ?string $url;
    public ?string $status;

    public \stdClass $info;

    public function __construct(int|array $wish, bool $generateCache = false)
    {
        global $database;

        $columns = array();

        if (is_numeric($wish)) {
            $wish = $database
            ->query('SELECT *
                       FROM `wishes`
                      WHERE `id` = ' . $wish . ';')
            ->fetch();

            $columns = $wish;
        } elseif (is_array($wish)) {
            $columns = $wish;
        }

        if ($columns) {
            foreach ($columns as $key => $value) {
                $this->$key = $value;
            }
        }

        $this->info = new \stdClass();

        if ($this->url) {
            $this->cache = new EmbedCache($this->url);
            $this->info  = $this->cache->get($generateCache);
        }

        foreach ($columns as $key => $value) {
            if (empty($value) && isset($this->info->$key)) {
                $this->$key = $this->info->$key;
            }
        }

        if (empty($this->image)) {
            $this->image = '/src/assets/img/no-image.svg';
        }
    }

    public function getCard(int $ofUser): string
    {
        ob_start();

        /**
         * Card
         */
        $userIsCurrent = isset($_SESSION['user']['id']) && intval($_SESSION['user']['id']) === $ofUser;

        if ($this->url) {
            $exists = $this->cache->exists() || !$this->url ? 'true' : 'false';
        } else {
            $exists = 'true';
        }
        ?>

        <div class="ui fluid card stretch" data-id="<?= $this->id ?>" data-cache="<?= $exists ?>">
            <div class="image">
                <?php if ($this->image) { ?>
                    <img class="preview" src="<?= $this->image ?>" loading="lazy" />
                <?php } ?>

                <?php if (isset($this->info->favicon)) { ?>
                    <img class="favicon" src="<?= $this->info->favicon ?>" loading="lazy" />
                <?php } ?>

                <?php if (isset($this->info->providerName)) { ?>
                    <span class="provider"><?= $this->info->providerName ?></span>
                <?php } ?>
            </div>

            <div class="overlay"></div>

            <div class="content">
                <?php if ($this->title) { ?>
                    <div class="header">
                        <?php if ($this->url) { ?>
                            <a href="<?= $this->url ?>" target="_blank"><?= $this->title ?></a>
                        <?php } else { ?>
                            <?= $this->title ?>
                        <?php } ?>
                    </div>
                <?php } ?>

                <?php if (isset($this->info->keywords)) { ?>
                    <div class="meta">
                        <?= implode(', ', $this->info->keywords) ?>
                    </div>
                <?php } ?>

                <?php if ($this->description) { ?>
                    <div class="description">
                        <?= $this->description ?>
                    </div>
                    <div class="description-fade"></div>
                <?php } ?>
            </div>

            <div class="extra content buttons">
                <?php if (!$userIsCurrent) { ?>
                    <a class="ui small primary labeled icon button commit">
                        <i class="shopping cart icon"></i>
                        Commit
                    </a>
                <?php } ?>

                <?php if ($this->url) { ?>
                    <a class="ui small labeled icon button" href="<?= $this->url ?>" target="_blank">
                        <i class="external icon"></i>
                        Visit
                    </a>
                <?php } ?>

                <?php if ($userIsCurrent) { ?>
                    <div class="ui small labeled icon top left pointing dropdown button options">
                        <i class="cog icon"></i>
                        <span class="text">Options</span>
                        <div class="menu">

                            <a class="item" href="/?page=wish&id=<?= $this->id ?>">
                                <i class="pen icon"></i>
                                Edit
                            </a>

                            <div class="item wish-delete">
                                <i class="trash icon"></i>
                                Delete
                            </div>

                        </div>
                    </div>
                <?php } ?>

            </div>
        </div>
        <?php

        $html = ob_get_clean();

        return $html;
    }
}
