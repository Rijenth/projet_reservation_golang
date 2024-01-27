package validators

type UpdateMenusDataValidator struct {
	Data struct {
		Type       string                `validate:"required,eq=menus"`
		Id         string                `validate:"required,number"`
		Attributes UpdateMenusAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdateMenusAttributes struct {
	Name  string  `validate:"required"`
	Price float64 `validate:"required"`
}
