import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';

interface BlockViewerProps {
    header: string;
    code?: string;
    new?: boolean;
    free?: boolean;
    containerClassName?: string;
    previewStyle?: React.CSSProperties;
    children: React.ReactNode;
}

const BlockViewer = (props: BlockViewerProps) => {
    const [blockView, setBlockView] = useState('PREVIEW');
    const actionCopyRef = useRef(null);

  

    return (
        <div className="block-viewer">
            <div className="block-section">
                <div className="block-header">
                    <span className="block-title">
                        <span>{props.header}</span>
                        {props.new && <span className="badge-new">New</span>}
                        {props.free && <span className="badge-free">Free</span>}
                    </span>
                    <div className="block-actions">
                       
                       
                      
                        <Tooltip target={actionCopyRef as any} position="bottom" content="Copied to clipboard" event="focus" />
                    </div>
                </div>
                <div className="block-content">
                    {blockView === 'PREVIEW' && (
                        <div className={props.containerClassName} style={props.previewStyle}>
                            {props.children}
                        </div>
                    )}

                
                </div>
            </div>
        </div>
    );
};

export default BlockViewer;
