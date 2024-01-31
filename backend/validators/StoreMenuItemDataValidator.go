package validators



type StoreMenuItemDataValidator struct {
	Data struct {
		Type       string `validate:"required,eq=menu_items"`
		Attributes struct {
			Name string `validate:"required,min=3,max=255"`
			Type string `validate:"required,min=3,max=255"`
			Price float64 `validate:"required"`
		} `json:"attributes"`
		Relationships struct {
			Restaurant struct {
				Type string `validate:"required,eq=restaurants"`
				ID   string `validate:"required"`
			} `validate:"required"`
			Menu struct {
				Type string `validate:"required,eq=menus"`
				ID   string `validate:"required"`
			} `validate:"required"`
		} `json:"relationships"`
	} `json:"data"`
}



