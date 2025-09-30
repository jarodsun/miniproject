# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

# 只排除确实不需要的大型第三方库
excludes = [
    'tkinter', 'matplotlib', 'numpy', 'pandas', 'scipy', 'PIL', 'cv2',
    'tensorflow', 'torch', 'sklearn', 'jupyter', 'notebook', 'IPython',
    'sphinx', 'pytest', 'unittest', 'doctest', 'pdb', 'profile',
    'multiprocessing', 'concurrent.futures', 'asyncio', 'threading',
    'distutils', 'setuptools', 'pip', 'wheel', 'pkg_resources'
]

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=excludes,
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

# 过滤掉不需要的模块
a.binaries = [x for x in a.binaries if not any(exclude in x[0].lower() for exclude in ['tk', 'matplotlib', 'numpy', 'pandas', 'scipy', 'pil', 'cv2'])]

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='MiniCRM',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,  # Windows下禁用strip（需要Unix工具）
    upx=True,    # 启用UPX压缩
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
