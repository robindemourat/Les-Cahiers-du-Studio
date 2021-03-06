module.exports = (function() {
  // Ready translated locale messages
  const messages = {
    fr: {
      ascending: 'Croissant',
      descending: 'Décroissant',
      create_a_folder: 'Créer un dossier',
      name: 'Nom',
      created_date: 'Date de création',
      start_date: 'Date de début',
      end_date: 'Date de fin',
      sent_date: 'Date d’envoi',
      for_the_placement_on_timeline: '(pour le placement sur la timeline)',
      type: 'Type',
      color: 'Couleur',
      keywords: 'Mot-clés',
      author: 'Auteur(s)',
      zoom: 'Zoom',
      download: 'Télécharger',
      caption: 'Légende',
      date: 'Date',

      loading: 'chargement',
      open: 'Ouvrir',
      save: 'Enregistrer',
      edit: 'Éditer',
      print: 'Imprimer',
      create: 'Créer',
      remove: 'Suppr.',
      password: 'Mot de passe',
      protected_by_pass: 'protégé par mot de passe',
      password_instructions: 'Si existant, seul les utilisateurs possédant ce mot de passe pourront modifier ce dossier et accéder aux médias non publics.',

      sort_by: 'Organiser par',
      in_the_order: 'Dans l’ordre',
      public: 'Public',
      content: 'Contenu',

      'lang:': 'Changer la langue&nbsp;:',

      toconnectwithanotherdevice: 'Pour accéder aux Cahiers avec un autre appareil, connectez-vous au même réseau wifi puis entrez l’url suivante dans le navigateur web (puis ignorez le message de sécurité)&nbsp;: ',
      toconnectwithanotherdevicetothisfolder : 'Pour accéder à ce dossier avec un autre appareil, connectez vous au même réseau wifi puis entrez l’url suivante dans le navigateur web (puis ignorez le message de sécurité)&nbsp;: ',
      sureToRemoveFolder: 'Êtes-vous sûr de vouloir supprimer ce dossier ?',
      sureToRemoveMedia: 'Êtes-vous sûr de vouloir supprimer ce média ?',

      create_a_folder: 'Créer un dossier',
      edit_the_media: 'Éditer le média',
      edit_folder: 'Éditer le dossier',

      capture_start: 'Début de la capture',
      capture_end: 'Fin de la capture',
      currently: 'Actuellement',

      more_information: 'Pour plus d’information, consultez la <a href="https://latelier-des-chercheurs.fr/docs/manuel-les-cahiers-du-studio" class="js--openInBrowser" target="_blank">documentation</a> ou <a href="mailto:info@latelier-des-chercheurs.fr?subject=Les Cahiers du Studio" class="js--openInBrowser" target="_blank">contactez</a> les auteurs de ce logiciel.',
      no_media_in_folder: 'Aucun média dans ce dossier.',
      no_public_media_in_folder: 'Aucun média public dans ce dossier.',
      auto_scroll: 'défilement<br>automatique',
      scale: 'échelle&nbsp;:',
      scale_items: {
        second: 'sec',
        minute: 'min',
        hour: 'h',
        half_day: '½j',
        day: 'j',
      },
      contents_are_stored: 'Les contenus de ce dossier sont enregistrés dans ',
      folder_information: 'Informations du dossier',
      calendar: 'Calendrier',
      now: 'en ce moment',
      list: 'Liste',
      fullscreen: 'Plein écran',
      preview: 'Aperçu',
      filter: 'Filtre',

      last_modified: 'Dernière modification',

      notifications: {
        file_was_sent: 'Le fichier a été envoyé.',

      }
    },
    en: {
      ascending: 'Ascending',
      descending: 'Descending',
      create_a_folder: 'Create a folder',
      name: 'Name',
      created_date: 'Created date',
      start_date: 'Start date',
      end_date: 'End date',
      sent_date: 'Sent date',
      for_the_placement_on_timeline: '(used for the position on the timeline)',
      type: 'Type',
      color: 'Color',
      keywords: 'Keywords',
      author: 'Author(s)',
      zoom: 'Zoom',
      download: 'Download',
      caption: 'Caption',
      date: 'Date',

      loading: 'loading',
      open: 'Open',
      save: 'Save',
      edit: 'Edit',
      print: 'Print',
      create: 'Create',
      remove: 'Remove',
      password: 'Mot de passe',
      protected_by_pass: 'protected by password',
      password_instructions: 'If set, only users with the password will be able to edit this folder and access the content that’s not public.',

      sort_by: 'Sort by',
      in_the_order: 'In the order',
      public: 'Public',
      content: 'Content',

      'lang:': 'Select lang:',

      toconnectwithanotherdevice: 'To access Les Cahiers with another device, connect to the same wifi network and type this adress in your browser (and ignore the security message):',
      toconnectwithanotherdevicetothisfolder: 'To access this folder in Les Cahiers with another device, connect to the same wifi network and type this adress in your browser (and ignore the security message):',
      sureToRemoveFolder : 'Do you really want to delete this folder?',
      sureToRemoveMedia: 'Do you really want to delete this media?',

      create_a_folder: 'Create a folder',
      edit_the_media: 'Edit media',
      edit_folder: 'Edit folder',

      capture_start: 'Start of the capture',
      capture_end: 'End of the capture',
      currently: 'Now',

      more_information: 'For more informations, read the <a href="https://latelier-des-chercheurs.fr/docs/manuel-les-cahiers-du-studio" class="js--openInBrowser" target="_blank">documentation (in french)</a> or <a href="mailto:info@latelier-des-chercheurs.fr?subject=Les Cahiers du Studio" class="js--openInBrowser" target="_blank">contact</a> the creators of this app.',

      no_media_in_folder: 'No media in this folder.',
      no_public_media_in_folder: 'No public media in this folder.',
      auto_scroll: 'autoscroll',
      scale: 'scale:',
      scale_items: {
        second: 'sec',
        minute: 'min',
        hour: 'h',
        half_day: '½d',
        day: 'd',
      },
      contents_are_stored: 'Contents for this folder are stored in ',
      folder_information: 'Folder information',
      calendar: 'Calendar',
      now: 'now',
      list: 'List',
      fullscreen: 'Fullscreen',
      preview: 'Preview',
      filter: 'Filter',

      last_modified: 'Last modified',

      notifications: {
        file_was_sent: 'The file was sent.',

      }
    }
  };

  return messages;
})();
