<template>
    <div class="block" style="width: 200px; float: left">
        <el-select :placeholder="!isMaxTotal ? `(${isTotal}) Selected` : 'All Selected'">
            <el-option v-if="isCheckAll == true">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check all</el-checkbox>
            </el-option>
            <el-checkbox-group v-model="checkedOption" @change="handleCheckedOptionChange">
                <el-option v-for="option in options" :key="option">
                    <el-checkbox :label="option" >
                        {{option.lable}}
                    </el-checkbox>
                </el-option>
            </el-checkbox-group>
        </el-select>
    </div>
</template>
<script>
import {
  lodash as _,
  mapActions
} from '~jsPath/lib/lib-manager';
import {
  MODULE_NAME as PAGE_INFO_MODULE_NAME,
  pageSearchModule
} from '~jsPath/base/vuex/modules/search-module';

export default {
    props: {
        options         : Array,
        isCheckAll      : Boolean,
        checkedOption   : Array,
    },
    data() {
      return {
            isCheckAll      : true,
            checkAll        : false,
            isIndeterminate : true,
            isTotal         : 0,
            isMaxTotal      : false,
        }
    },

    created() {
        this.$store.registerModule(PAGE_INFO_MODULE_NAME, pageSearchModule);
        this.defaultSelected();
    },
    
    methods: {
        ...mapActions(PAGE_INFO_MODULE_NAME, {
            setCheckboxInfo: "setCheckboxInfo"
        }),
        defaultSelected() {
            this.options.forEach(element => {
                if(element.status == true) {
                    this.checkedOption.push(element)
                }


                if(this.options.length == this.checkedOption.length) {
                    this.handleCheckAllChange(this.checkedOption);
                } else {
                    this.handleCheckedOptionChange(this.checkedOption);
                }
            });    
        },
        handleCheckAllChange(val) {
            this.checkedOption      = val ? this.options : [];
            this.isIndeterminate    = false;
            this.isTotal            = this.checkedOption.length;
            this.isMaxTotal         = this.checkedOption.length == this.options.length ? true : false
        },
        handleCheckedOptionChange(value) {
            let checkedCount        = value.length;
            this.checkAll           = checkedCount === this.options.length;
            this.isIndeterminate    = checkedCount > 0 && checkedCount < this.options.length;
            this.isTotal            = value.length;
            this.isMaxTotal         = this.checkedOption.length == this.options.length ? true : false
        }
    },
    watch: {
        "checkedOption": function() {
            this.setCheckboxInfo(this.checkedOption);
        }
    }
  };
</script>