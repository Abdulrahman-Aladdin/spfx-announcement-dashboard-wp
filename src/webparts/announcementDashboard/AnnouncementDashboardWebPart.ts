import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AnnouncementDashboardWebPartStrings';
import AnnouncementDashboard from './components/AnnouncementDashboard';
import { IAnnouncementDashboardProps } from './components/IAnnouncementDashboardProps';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import { PropertyFieldChoiceGroupWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldChoiceGroupWithCallout';
import { PropertyFieldToggleWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldToggleWithCallout';
import { PropertyFieldSliderWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldSliderWithCallout';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

export interface IAnnouncementDashboardWebPartProps {
  wpTitle: string;
  listId: string;
  layoutStyle: string;
  enableFiltering: boolean;
  numberOfItems: number;
  language: string;
  headerBackgroundColor: string;
}

export default class AnnouncementDashboardWebPart extends BaseClientSideWebPart<IAnnouncementDashboardWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IAnnouncementDashboardProps> = React.createElement(
      AnnouncementDashboard,
      {
        title: this.properties.wpTitle,
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('wpTitle', {
                  label: strings.WebPartTitleLabel
                }),
                PropertyFieldListPicker('listId', {
                  label: strings.ListIdLabel,
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
                  calloutContent: React.createElement('div', {}, strings.LayoutStyleCalloutContent),
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'choiceGroupWithCalloutFieldId',
                  label: strings.LayoutStyleLabel,
                  options: [{
                    key: 'card',
                    text: strings.LayoutStyleCard,
                    checked: this.properties.layoutStyle === 'card'
                  }, {
                    key: 'compact',
                    text: strings.LayoutStyleCompact,
                    checked: this.properties.layoutStyle === 'compact'
                  }, {
                    key: 'table',
                    text: strings.LayoutStyleTable,
                    checked: this.properties.layoutStyle === 'table'
                  }]
                }),
                PropertyFieldToggleWithCallout('enableFiltering', {
                  calloutTrigger: CalloutTriggers.Click,
                  key: 'toggleInfoHeaderFieldId',
                  label: strings.EnableFilteringLabel,
                  calloutContent: React.createElement('p', {}, strings.EnableFilteringCalloutContent),
                  onText: strings.EnableFilteringOnText,
                  offText: strings.EnableFilteringOffText,
                  checked: this.properties.enableFiltering
                }),
                PropertyFieldSliderWithCallout('numberOfItems', {
                  calloutContent: React.createElement('div', {}, strings.NumberOfItemsCalloutContent),
                  calloutTrigger: CalloutTriggers.Click,
                  calloutWidth: 200,
                  key: 'sliderWithCalloutFieldId',
                  label: strings.NumberOfItemsLabel,
                  max: 100,
                  min: 0,
                  step: 1,
                  showValue: true,
                  value: this.properties.numberOfItems,
                  debounce: 1000
                }),
                PropertyFieldChoiceGroupWithCallout('language', {
                  calloutContent: React.createElement('div', {}, strings.LanguageCalloutContent),
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'choiceGroupWithCalloutFieldId',
                  label: strings.LanguageLabel,
                  options: [{
                    key: 'en',
                    text: strings.LanguageEnglish,
                    checked: this.properties.language === 'en'
                  }, {
                    key: 'ar',
                    text: strings.LanguageArabic,
                    checked: this.properties.language === 'ar'
                  }]
                }),
                PropertyFieldColorPicker('headerBackgroundColor', {
                  label: strings.HeaderBackgroundColorLabel,
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
