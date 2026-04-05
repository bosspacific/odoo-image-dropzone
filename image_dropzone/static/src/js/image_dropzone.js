/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState, xml } from "@odoo/owl";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { useService } from "@web/core/utils/hooks";

export class ImageDropZoneField extends Component {
    static template = xml`
        <div class="o_field_image_dropzone"
             t-att-class="{'o_dragging': state.isDragging}"
             t-on-dragover.prevent.stop="onDragOver"
             t-on-dragleave.prevent.stop="onDragLeave"
             t-on-drop.prevent.stop="onDrop">
            <t t-if="showImage">
                <div class="position-relative d-inline-block">
                    <img t-att-src="url" class="img-fluid rounded"
                         style="max-height: 300px; max-width: 100%; cursor: pointer; object-fit: contain;"
                         t-on-click="onClickUpload"/>
                    <div class="position-absolute bottom-0 start-0 end-0 text-center py-1 small rounded-bottom"
                         style="background: rgba(0,0,0,0.5); color: white;">
                        Click image or drag new image to replace
                    </div>
                </div>
            </t>
            <t t-else="">
                <div class="text-center p-4 rounded o_dropzone_empty"
                     t-on-click="onClickUpload">
                    <i class="fa fa-cloud-upload fa-3x mb-3 o_dropzone_icon"/>
                    <p class="mb-1 fw-bold o_dropzone_title">Drag &amp; Drop Image Here</p>
                    <p class="text-muted small mb-0">or click to browse files</p>
                </div>
            </t>
        </div>
    `;
    static props = {
        ...standardFieldProps,
    };

    setup() {
        this.state = useState({ isDragging: false });
        this.notification = useService("notification");
    }

    get value() {
        return this.props.record.data[this.props.name];
    }

    get showImage() {
        const opts = this.props.options || {};
        if (opts.always_dropzone) return false;
        return !!this.value;
    }

    get url() {
        if (this.value) {
            const model = this.props.record.resModel;
            const id = this.props.record.resId;
            const field = this.props.name;
            return '/web/image/' + model + '/' + id + '/' + field + '?unique=' + Date.now();
        }
        return "";
    }

    onDragOver(ev) { this.state.isDragging = true; }
    onDragLeave(ev) { this.state.isDragging = false; }

    async onDrop(ev) {
        this.state.isDragging = false;
        const files = ev.dataTransfer?.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) {
            this.notification.add("Only image files are accepted", { type: "warning" });
            return;
        }
        await this._uploadFile(file);
    }

    onClickUpload() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) await this._uploadFile(file);
        };
        input.click();
    }

    async _uploadFile(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result.split(",")[1];
            await this.props.record.update({ [this.props.name]: base64 });
        };
        reader.readAsDataURL(file);
    }
}

export const imageDropZoneField = {
    component: ImageDropZoneField,
    supportedTypes: ["binary"],
    extractProps(fieldInfo) {
        return { options: fieldInfo.options || {} };
    },
};

registry.category("fields").add("image_dropzone", imageDropZoneField);
