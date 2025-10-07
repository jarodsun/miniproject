'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  ArrowBack, 
  CloudUpload, 
  CheckCircle,
  Person,
  Phone,
  LocationOn,
  Description
} from '@mui/icons-material';
import Link from 'next/link';

interface FormData {
  name: string;
  phone: string;
  region: string;
  introduction: string;
  licenseImages: File[];
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    region: '',
    introduction: '',
    licenseImages: []
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      licenseImages: [...prev.licenseImages, ...validFiles]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      licenseImages: prev.licenseImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 验证必填字段
      if (!formData.name || !formData.phone || !formData.region) {
        setMessage({ type: 'error', text: '请填写所有必填项' });
        return;
      }

      if (formData.licenseImages.length === 0) {
        setMessage({ type: 'error', text: '请上传至少一张执照照片' });
        return;
      }

      // 先上传文件
      const uploadFormData = new FormData();
      formData.licenseImages.forEach((file) => {
        uploadFormData.append('licenseImages', file);
      });

      const uploadResponse = await fetch('/api/upload/license', {
        method: 'POST',
        body: uploadFormData
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setMessage({ type: 'error', text: uploadResult.message || '文件上传失败' });
        return;
      }

      // 提交注册数据
      const response = await fetch('/api/pilots/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          region: formData.region,
          introduction: formData.introduction,
          licenseImages: uploadResult.files
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '注册成功！我们会尽快与您联系。' });
        // 清空表单
        setFormData({
          name: '',
          phone: '',
          region: '',
          introduction: '',
          licenseImages: []
        });
      } else {
        setMessage({ type: 'error', text: result.message || '注册失败，请重试' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请检查网络连接后重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 4 }}>
          <Link href="/" passHref>
            <Button
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              返回首页
            </Button>
          </Link>
          
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#333',
              mb: 2
            }}
          >
            飞手注册
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              color: '#666',
              mb: 4
            }}
          >
            请填写您的详细信息，加入我们的专业飞手资源库
          </Typography>
        </Box>

        <Card sx={{ 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}>
          <CardContent sx={{ p: 4 }}>
            {message && (
              <Alert 
                severity={message.type} 
                sx={{ mb: 3 }}
                onClose={() => setMessage(null)}
              >
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* 姓名 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  姓名 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="请输入您的姓名"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: '#667eea' }} />
                  }}
                />
              </Box>

              {/* 电话号码 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  电话号码 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="请输入您的手机号码"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  required
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: '#667eea' }} />
                  }}
                />
              </Box>

              {/* 所在地区 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  所在地区 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="请输入您所在的省市区"
                  value={formData.region}
                  onChange={handleInputChange('region')}
                  required
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: '#667eea' }} />
                  }}
                />
              </Box>

              {/* 自我介绍 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  自我介绍
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="请介绍您的飞行经验、专业技能、服务区域等信息（最多500字）"
                  value={formData.introduction}
                  onChange={handleInputChange('introduction')}
                  inputProps={{ maxLength: 500 }}
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1, color: '#667eea', alignSelf: 'flex-start', mt: 1 }} />
                  }}
                />
                <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                  {formData.introduction.length}/500
                </Typography>
              </Box>

              {/* 执照照片上传 */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  电子执照照片 <span style={{ color: 'red' }}>*</span>
                </Typography>
                
                <input
                  type="file"
                  id="license-upload"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                
                <label htmlFor="license-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    sx={{ mb: 2 }}
                  >
                    选择文件
                  </Button>
                </label>
                
                <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#666' }}>
                  支持 JPG、PNG、PDF 格式，单个文件最大 10MB
                </Typography>

                {/* 已选择的文件 */}
                {formData.licenseImages.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.licenseImages.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeImage(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* 提交按钮 */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  backgroundColor: '#667eea',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#5a6fd8'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    提交中...
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle />
                    立即注册
                  </Box>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}