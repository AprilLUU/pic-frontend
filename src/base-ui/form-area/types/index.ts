export interface FormList {
  // common
  label?: string
  name?: string
  type?: string
  field?: string
  placeholder?: string
  allowClear?: boolean
  styleObj?: any
  // select
  mode?: string
  options?: any
  // textarea
  sizeObj?: any
  // input-number
  min?: number
  max?: number
  // form-item
  rules?: any
}
