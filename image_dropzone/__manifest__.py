{
    'name': 'Image Drag & Drop Widget',
    'version': '19.0.1.0.0',
    'category': 'Tools',
    'summary': 'Drag-and-drop image upload widget for any Binary/Image field',
    'description': """
Image Drag & Drop Widget
=========================

A modern, reusable drag-and-drop image upload widget for Odoo 19.

Features
--------
* Drop zone with dashed border and upload icon when no image is set
* Image preview with overlay when image exists
* Click-to-browse file picker
* Drag highlight with Odoo purple accent
* ``always_dropzone`` option to force empty drop zone (useful alongside a preview)
* Works on ANY Binary or Image field in ANY model
* Zero dependencies beyond ``web``

Usage
-----
In your XML view, use ``widget="image_dropzone"`` on any Binary field::

    <field name="image_1920" widget="image_dropzone"/>

To always show the empty drop zone (e.g. beside a preview)::

    <field name="image_1920" widget="image_dropzone"
           options='{"always_dropzone": true}'/>

License
-------
LGPL-3
    """,
    'author': 'BOSS Pacific Information Systems',
    'website': 'https://bosspacific.com.au',
    'license': 'LGPL-3',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'image_dropzone/static/src/css/image_dropzone.css',
            'image_dropzone/static/src/js/image_dropzone.js',
        ],
    },
    'images': ['static/description/banner.png'],
    'installable': True,
    'auto_install': False,
    'application': False,
}
