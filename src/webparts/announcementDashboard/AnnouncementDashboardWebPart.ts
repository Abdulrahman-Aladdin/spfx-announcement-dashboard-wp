import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';


import arStrings from './loc/ar-sa';
import enStrings from './loc/en-us';
import { IAnnouncementDashboardWebPartStrings } from './loc/mystrings';
import AnnouncementDashboard from './components/AnnouncementDashboard';
import { IAnnouncementDashboardProps } from './components/IAnnouncementDashboardProps';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import { PropertyFieldChoiceGroupWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldChoiceGroupWithCallout';
import { PropertyFieldToggleWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldToggleWithCallout';
import { PropertyFieldSliderWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldSliderWithCallout';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

export interface IAnnouncementDashboardWebPartProps {
  wpEnTitle: string;
  wpArTitle: string;
  listId: string;
  layoutStyle: string;
  enableFiltering: boolean;
  numberOfItems: number;
  language: string;
  headerBackgroundColor: string;
}

export default class AnnouncementDashboardWebPart extends BaseClientSideWebPart<IAnnouncementDashboardWebPartProps> {
  private strings: IAnnouncementDashboardWebPartStrings = enStrings;
  private directtion: 'rtl' | 'ltr' = 'ltr';

  private getStrings(): IAnnouncementDashboardWebPartStrings {
    return this.properties.language === 'ar' ? arStrings : enStrings;
  }

  private getDirection(): 'rtl' | 'ltr' {
    return this.properties.language === 'ar' ? 'rtl' : 'ltr';
  }

  protected onInit(): Promise<void> {
    this.strings = this.getStrings();
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IAnnouncementDashboardProps> = React.createElement(
      AnnouncementDashboard,
      {
        enTitle: this.properties.wpEnTitle,
        arTitle: this.properties.wpArTitle,
        listId: this.properties.listId,
        layoutStyle: this.properties.layoutStyle,
        enableFiltering: this.properties.enableFiltering,
        numberOfItems: this.properties.numberOfItems,
        language: this.properties.language,
        headerBackgroundColor: this.properties.headerBackgroundColor
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === 'language' && oldValue !== newValue) {
      this.strings = this.getStrings();
      this.directtion = this.getDirection();
      this.domElement.setAttribute('dir', this.directtion);
      this.context.propertyPane.refresh();
      this.render();
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: this.strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: this.strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('wpEnTitle', {
                  label: this.strings.WebPartEnTitleLabel
                }),
                PropertyPaneTextField('wpArTitle', {
                  label: this.strings.WebPartArTitleLabel
                }),
                PropertyFieldListPicker('listId', {
                  label: this.strings.ListIdLabel,
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  multiSelect: false
                }),
                PropertyFieldChoiceGroupWithCallout('layoutStyle', {
                  calloutContent: React.createElement('div', {}, this.strings.LayoutStyleCalloutContent),
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'choiceGroupWithCalloutFieldId',
                  label: this.strings.LayoutStyleLabel,
                  options: [{
                    key: 'card',
                    text: this.strings.LayoutStyleCard,
                    checked: this.properties.layoutStyle === 'card'
                  }, {
                    key: 'compact',
                    text: this.strings.LayoutStyleCompact,
                    checked: this.properties.layoutStyle === 'compact'
                  }, {
                    key: 'table',
                    text: this.strings.LayoutStyleTable,
                    checked: this.properties.layoutStyle === 'table'
                  }]
                }),
                PropertyFieldToggleWithCallout('enableFiltering', {
                  calloutTrigger: CalloutTriggers.Click,
                  key: 'toggleInfoHeaderFieldId',
                  label: this.strings.EnableFilteringLabel,
                  calloutContent: React.createElement('p', {}, this.strings.EnableFilteringCalloutContent),
                  onText: this.strings.EnableFilteringOnText,
                  offText: this.strings.EnableFilteringOffText,
                  checked: this.properties.enableFiltering
                }),
                PropertyFieldSliderWithCallout('numberOfItems', {
                  calloutContent: React.createElement('div', {}, this.strings.NumberOfItemsCalloutContent),
                  calloutTrigger: CalloutTriggers.Click,
                  calloutWidth: 200,
                  key: 'sliderWithCalloutFieldId',
                  label: this.strings.NumberOfItemsLabel,
                  max: 20,
                  min: 1,
                  step: 1,
                  showValue: true,
                  value: this.properties.numberOfItems,
                  debounce: 1000
                }),
                PropertyFieldChoiceGroupWithCallout('language', {
                  calloutContent: React.createElement('div', {}, this.strings.LanguageCalloutContent),
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'choiceGroupWithCalloutFieldId',
                  label: this.strings.LanguageLabel,
                  options: [{
                    key: 'en',
                    text: this.strings.LanguageEnglish,
                    checked: this.properties.language === 'en'
                  }, {
                    key: 'ar',
                    text: this.strings.LanguageArabic,
                    checked: this.properties.language === 'ar'
                  }]
                }),
                PropertyFieldColorPicker('headerBackgroundColor', {
                  label: this.strings.HeaderBackgroundColorLabel,
                  selectedColor: this.properties.headerBackgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 1000,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Precipitation',
                  key: 'headerBackgroundColorFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
