import React, { FC } from 'react';
import './_popup_tabs.scss';

interface PopupProps {
  children?: any;
  activeTab?: 'solid' | 'gradient';
  tabName?: string;
  popupWidth?: number;
  onClick?: () => void;
}

export const PopupTabs: FC<PopupProps> = ({
  children,
  activeTab,
  popupWidth
}: PopupProps) => {
  const childrenContact = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      activeTab
    });
  });

  return (
    <div className='popup_tabs' style={{ width: `${popupWidth}px` }}>
      {childrenContact}
    </div>
  );
};

export const PopupTabsHeaderLabel: FC<PopupProps> = ({
  children,
  activeTab,
  tabName,
  onClick
}: PopupProps) => {
  return (
    <div
      className={`popup_tabs-header-label${
        activeTab === tabName ? ' popup_tabs-header-label-active' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const PopupTabsHeader: FC<PopupProps> = ({
  children,
  activeTab
}: PopupProps) => {
  const childrenContact = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      activeTab
    });
  });
  return <div className='popup_tabs-header'>{childrenContact}</div>;
};

export const PopupTabsBody: FC<PopupProps> = ({ children, activeTab }) => {
  const childrenContact = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      activeTab
    });
  });

  return <div className='popup_tabs-body'>{childrenContact}</div>;
};

export const PopupTabsBodyItem: FC<PopupProps> = ({
  children,
  activeTab,
  tabName
}: PopupProps) => {
  if (activeTab === tabName) {
    return <div className='popup_tabs-body-item'>{children}</div>;
  }

  return null;
};
